import { InMemoryAuditLogger } from "../audit";
import { InMemoryMetricsCollector } from "../metrics";
import { getPredefinedRole, RBACManager } from "../rbac";
import type {
  AuditLogEntry,
  DetectionResult,
  IAuditLogger,
  IMetricsCollector,
  IRBACManager,
  RedactionMode,
} from "../types";
export interface AuditConfig {
  enableAuditLog?: boolean;
  auditLogger?: IAuditLogger;
  auditUser?: string;
  auditSessionId?: string;
  auditMetadata?: Record<string, unknown>;
  enableMetrics?: boolean;
  metricsCollector?: IMetricsCollector;
  enableRBAC?: boolean;
  rbacManager?: IRBACManager;
  role?: import("../types").RoleName;
}

export class AuditManager {
  private auditLogger?: IAuditLogger;
  private auditUser?: string;
  private auditSessionId?: string;
  private auditMetadata?: Record<string, unknown>;
  private metricsCollector?: IMetricsCollector;
  private rbacManager?: IRBACManager;

  constructor(config: AuditConfig) {
    if (config.enableAuditLog) {
      this.auditLogger = config.auditLogger || new InMemoryAuditLogger();
      this.auditUser = config.auditUser;
      this.auditSessionId = config.auditSessionId;
      this.auditMetadata = config.auditMetadata;
    }

    if (config.enableMetrics) {
      this.metricsCollector =
        config.metricsCollector || new InMemoryMetricsCollector();
    }

    if (config.enableRBAC) {
      if (config.rbacManager) {
        this.rbacManager = config.rbacManager;
      } else if (config.role) {
        const role = getPredefinedRole(config.role);
        if (role) {
          this.rbacManager = new RBACManager(role);
        }
      } else {
        this.rbacManager = new RBACManager();
      }
    }
  }

  getAuditLogger(): IAuditLogger | undefined {
    if (this.rbacManager && !this.rbacManager.hasPermission("audit:read")) {
      throw new Error("[OpenRedaction] Permission denied: audit:read required");
    }

    return this.auditLogger;
  }

  getMetricsCollector(): IMetricsCollector | undefined {
    if (this.rbacManager && !this.rbacManager.hasPermission("metrics:read")) {
      throw new Error(
        "[OpenRedaction] Permission denied: metrics:read required",
      );
    }

    return this.metricsCollector;
  }

  getRBACManager(): IRBACManager | undefined {
    return this.rbacManager;
  }

  checkPermission(permission: import("../types").Permission): boolean {
    if (!this.rbacManager) return true;
    return this.rbacManager.hasPermission(permission);
  }

  logAudit(
    operation: AuditLogEntry["operation"],
    piiCount: number,
    piiTypes: string[],
    textLength: number,
    processingTimeMs: number,
    redactionMode: RedactionMode,
    debug: boolean,
  ): void {
    if (!this.auditLogger) return;

    try {
      this.auditLogger.log({
        operation,
        piiCount,
        piiTypes,
        textLength,
        processingTimeMs,
        redactionMode,
        success: true,
        user: this.auditUser,
        sessionId: this.auditSessionId,
        metadata: this.auditMetadata,
      });
    } catch (error) {
      if (debug) {
        console.error("[OpenRedaction] Audit logging failed:", error);
      }
    }
  }

  recordMetrics(
    result: DetectionResult,
    processingTime: number,
    redactionMode: RedactionMode,
    debug: boolean,
  ): void {
    if (!this.metricsCollector) return;

    try {
      this.metricsCollector.recordRedaction(
        result,
        processingTime,
        redactionMode,
      );
    } catch (error) {
      if (debug) {
        console.error("[OpenRedaction] Metrics recording failed:", error);
      }
    }
  }
}
