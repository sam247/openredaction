/**
 * openredaction — backward-compatibility shim
 *
 * Re-exports everything from @openredaction/core and @openredaction/express
 * so existing `import { OpenRedaction, openredactionMiddleware } from "openredaction"`
 * continues to work.
 *
 * Infrastructure symbols that moved to core subpaths are re-exported here so
 * `require("openredaction")` still exposes them after the core v2 split.
 */

export * from "@openredaction/core";
export {
  ConsoleAuditLogger,
  createPersistentAuditLogger,
  InMemoryAuditLogger,
  PersistentAuditLogger,
} from "@openredaction/core/audit";
export {
  BatchProcessor,
  createBatchProcessor,
} from "@openredaction/core/batch";
export {
  createDocumentProcessor,
  DocumentProcessor,
} from "@openredaction/core/documents";
export {
  createHealthChecker,
  HealthChecker,
} from "@openredaction/core/health";
export { InMemoryMetricsCollector } from "@openredaction/core/metrics";
export { createRBACManager, RBACManager } from "@openredaction/core/rbac";
export {
  createStreamingDetector,
  StreamingDetector,
} from "@openredaction/core/streaming";
export {
  createTenantManager,
  TenantManager,
} from "@openredaction/core/tenancy";
export { WebhookManager } from "@openredaction/core/webhooks";
export * from "@openredaction/express";
