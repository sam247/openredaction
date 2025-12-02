/**
 * Multi-tenancy support for SaaS deployments
 * Provides tenant isolation, quotas, and per-tenant configuration
 */

import type {
  OpenRedactionOptions,
  PIIPattern,
  IAuditLogger,
  IMetricsCollector
} from '../types';
import { OpenRedaction } from '../detector';

/**
 * Tenant configuration
 */
export interface TenantConfig {
  /** Tenant unique identifier */
  tenantId: string;
  /** Tenant display name */
  name: string;
  /** Tenant-specific OpenRedaction options */
  options?: OpenRedactionOptions;
  /** Tenant-specific custom patterns */
  customPatterns?: PIIPattern[];
  /** Tenant-specific whitelist */
  whitelist?: string[];
  /** Tenant quota limits */
  quotas?: TenantQuotas;
  /** Tenant API key (for authentication) */
  apiKey?: string;
  /** Tenant metadata */
  metadata?: Record<string, unknown>;
  /** Tenant status */
  status: 'active' | 'suspended' | 'trial';
  /** Trial expiry date (for trial tenants) */
  trialExpiresAt?: Date;
  /** Created timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
}

/**
 * Tenant quota limits
 */
export interface TenantQuotas {
  /** Maximum requests per month (undefined = unlimited) */
  maxRequestsPerMonth?: number;
  /** Maximum text length per request (characters) */
  maxTextLength?: number;
  /** Maximum patterns allowed */
  maxPatterns?: number;
  /** Maximum audit logs to retain */
  maxAuditLogs?: number;
  /** Rate limit: requests per minute */
  rateLimit?: number;
}

/**
 * Tenant usage statistics
 */
export interface TenantUsage {
  /** Tenant ID */
  tenantId: string;
  /** Total requests this month */
  requestsThisMonth: number;
  /** Total text processed this month (characters) */
  textProcessedThisMonth: number;
  /** Total PII detected this month */
  piiDetectedThisMonth: number;
  /** Last request timestamp */
  lastRequestAt?: Date;
  /** Monthly usage reset date */
  monthlyResetDate: Date;
}

/**
 * Tenant quota exceeded error
 */
export class TenantQuotaExceededError extends Error {
  constructor(
    public tenantId: string,
    public quota: string,
    public limit: number,
    public current: number
  ) {
    super(`Tenant ${tenantId} exceeded ${quota} quota: ${current}/${limit}`);
    this.name = 'TenantQuotaExceededError';
  }
}

/**
 * Tenant not found error
 */
export class TenantNotFoundError extends Error {
  constructor(public tenantId: string) {
    super(`Tenant not found: ${tenantId}`);
    this.name = 'TenantNotFoundError';
  }
}

/**
 * Tenant suspended error
 */
export class TenantSuspendedError extends Error {
  constructor(public tenantId: string) {
    super(`Tenant is suspended: ${tenantId}`);
    this.name = 'TenantSuspendedError';
  }
}

/**
 * Multi-tenant manager for SaaS deployments
 */
export class TenantManager {
  private tenants: Map<string, TenantConfig> = new Map();
  private usage: Map<string, TenantUsage> = new Map();
  private detectors: Map<string, OpenRedaction> = new Map();
  private rateLimitTracking: Map<string, number[]> = new Map();
  private auditLoggers: Map<string, IAuditLogger> = new Map();
  private metricsCollectors: Map<string, IMetricsCollector> = new Map();

  /**
   * Register a new tenant
   */
  registerTenant(config: Omit<TenantConfig, 'createdAt' | 'updatedAt'>): TenantConfig {
    if (this.tenants.has(config.tenantId)) {
      throw new Error(`Tenant already exists: ${config.tenantId}`);
    }

    const fullConfig: TenantConfig = {
      ...config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tenants.set(config.tenantId, fullConfig);

    // Initialize usage tracking
    this.usage.set(config.tenantId, {
      tenantId: config.tenantId,
      requestsThisMonth: 0,
      textProcessedThisMonth: 0,
      piiDetectedThisMonth: 0,
      monthlyResetDate: this.getNextMonthlyResetDate()
    });

    // Initialize rate limit tracking
    this.rateLimitTracking.set(config.tenantId, []);

    return fullConfig;
  }

  /**
   * Update tenant configuration
   */
  updateTenant(tenantId: string, updates: Partial<Omit<TenantConfig, 'tenantId' | 'createdAt'>>): TenantConfig {
    const config = this.getTenantConfig(tenantId);

    const updated: TenantConfig = {
      ...config,
      ...updates,
      updatedAt: new Date()
    };

    this.tenants.set(tenantId, updated);

    // Clear cached detector to force recreation with new config
    this.detectors.delete(tenantId);

    return updated;
  }

  /**
   * Get tenant configuration
   */
  getTenantConfig(tenantId: string): TenantConfig {
    const config = this.tenants.get(tenantId);
    if (!config) {
      throw new TenantNotFoundError(tenantId);
    }
    return config;
  }

  /**
   * Get or create tenant-specific detector instance
   */
  getDetector(tenantId: string): OpenRedaction {
    this.validateTenantStatus(tenantId);

    // Return cached detector if exists
    if (this.detectors.has(tenantId)) {
      return this.detectors.get(tenantId)!;
    }

    // Create new detector with tenant config
    const config = this.getTenantConfig(tenantId);
    const options: OpenRedactionOptions = {
      ...config.options,
      customPatterns: config.customPatterns,
      whitelist: config.whitelist,
      auditLogger: this.getAuditLogger(tenantId),
      metricsCollector: this.getMetricsCollector(tenantId),
      auditUser: config.tenantId,
      auditMetadata: {
        tenantId: config.tenantId,
        tenantName: config.name
      }
    };

    const detector = new OpenRedaction(options);
    this.detectors.set(tenantId, detector);

    return detector;
  }

  /**
   * Perform detection with tenant isolation and quota checks
   */
  async detect(tenantId: string, text: string): Promise<any> {
    // Validate tenant status
    this.validateTenantStatus(tenantId);

    // Check quotas
    await this.checkQuotas(tenantId, text);

    // Track usage
    this.trackRequest(tenantId, text);

    // Get tenant detector and perform detection
    const detector = this.getDetector(tenantId);
    const result = await detector.detect(text);

    // Update usage stats
    const usage = this.usage.get(tenantId)!;
    usage.piiDetectedThisMonth += result.detections.length;
    usage.lastRequestAt = new Date();

    return result;
  }

  /**
   * Validate tenant status (active, trial expiry)
   */
  private validateTenantStatus(tenantId: string): void {
    const config = this.getTenantConfig(tenantId);

    // Check if suspended
    if (config.status === 'suspended') {
      throw new TenantSuspendedError(tenantId);
    }

    // Check trial expiry
    if (config.status === 'trial' && config.trialExpiresAt) {
      if (new Date() > config.trialExpiresAt) {
        throw new TenantSuspendedError(tenantId);
      }
    }
  }

  /**
   * Check tenant quotas before processing
   */
  private async checkQuotas(tenantId: string, text: string): Promise<void> {
    const config = this.getTenantConfig(tenantId);
    const usage = this.usage.get(tenantId)!;

    // Check if monthly reset is needed
    if (new Date() > usage.monthlyResetDate) {
      this.resetMonthlyUsage(tenantId);
    }

    const quotas = config.quotas;
    if (!quotas) {
      return; // No quotas configured
    }

    // Check monthly request limit
    if (quotas.maxRequestsPerMonth !== undefined) {
      if (usage.requestsThisMonth >= quotas.maxRequestsPerMonth) {
        throw new TenantQuotaExceededError(
          tenantId,
          'maxRequestsPerMonth',
          quotas.maxRequestsPerMonth,
          usage.requestsThisMonth
        );
      }
    }

    // Check text length limit
    if (quotas.maxTextLength !== undefined) {
      if (text.length > quotas.maxTextLength) {
        throw new TenantQuotaExceededError(
          tenantId,
          'maxTextLength',
          quotas.maxTextLength,
          text.length
        );
      }
    }

    // Check rate limit
    if (quotas.rateLimit !== undefined) {
      const requestsInLastMinute = this.getRequestsInLastMinute(tenantId);
      if (requestsInLastMinute >= quotas.rateLimit) {
        throw new TenantQuotaExceededError(
          tenantId,
          'rateLimit',
          quotas.rateLimit,
          requestsInLastMinute
        );
      }
    }

    // Check pattern count limit
    if (quotas.maxPatterns !== undefined) {
      const patternCount = config.customPatterns?.length || 0;
      if (patternCount > quotas.maxPatterns) {
        throw new TenantQuotaExceededError(
          tenantId,
          'maxPatterns',
          quotas.maxPatterns,
          patternCount
        );
      }
    }
  }

  /**
   * Track request for usage and rate limiting
   */
  private trackRequest(tenantId: string, text: string): void {
    const usage = this.usage.get(tenantId)!;

    // Update monthly usage
    usage.requestsThisMonth++;
    usage.textProcessedThisMonth += text.length;

    // Track for rate limiting (store timestamp)
    const timestamps = this.rateLimitTracking.get(tenantId) || [];
    timestamps.push(Date.now());

    // Keep only last 60 seconds of timestamps
    const oneMinuteAgo = Date.now() - 60 * 1000;
    const recentTimestamps = timestamps.filter(ts => ts > oneMinuteAgo);
    this.rateLimitTracking.set(tenantId, recentTimestamps);
  }

  /**
   * Get number of requests in last minute
   */
  private getRequestsInLastMinute(tenantId: string): number {
    const timestamps = this.rateLimitTracking.get(tenantId) || [];
    const oneMinuteAgo = Date.now() - 60 * 1000;
    return timestamps.filter(ts => ts > oneMinuteAgo).length;
  }

  /**
   * Reset monthly usage statistics
   */
  private resetMonthlyUsage(tenantId: string): void {
    const usage = this.usage.get(tenantId);
    if (!usage) {
      return;
    }

    usage.requestsThisMonth = 0;
    usage.textProcessedThisMonth = 0;
    usage.piiDetectedThisMonth = 0;
    usage.monthlyResetDate = this.getNextMonthlyResetDate();
  }

  /**
   * Get next monthly reset date (1st of next month)
   */
  private getNextMonthlyResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  }

  /**
   * Get tenant usage statistics
   */
  getTenantUsage(tenantId: string): TenantUsage {
    this.validateTenantExists(tenantId);

    const usage = this.usage.get(tenantId);
    if (!usage) {
      throw new Error(`Usage data not found for tenant: ${tenantId}`);
    }

    return { ...usage };
  }

  /**
   * Get all tenants
   */
  getAllTenants(): TenantConfig[] {
    return Array.from(this.tenants.values());
  }

  /**
   * Get tenants by status
   */
  getTenantsByStatus(status: TenantConfig['status']): TenantConfig[] {
    return Array.from(this.tenants.values()).filter(t => t.status === status);
  }

  /**
   * Authenticate tenant by API key
   */
  authenticateByApiKey(apiKey: string): TenantConfig | null {
    for (const config of this.tenants.values()) {
      if (config.apiKey === apiKey) {
        return config;
      }
    }
    return null;
  }

  /**
   * Suspend a tenant
   */
  suspendTenant(tenantId: string): void {
    this.updateTenant(tenantId, { status: 'suspended' });
  }

  /**
   * Activate a tenant
   */
  activateTenant(tenantId: string): void {
    this.updateTenant(tenantId, { status: 'active' });
  }

  /**
   * Delete a tenant and all associated data
   */
  deleteTenant(tenantId: string): void {
    this.validateTenantExists(tenantId);

    this.tenants.delete(tenantId);
    this.usage.delete(tenantId);
    this.detectors.delete(tenantId);
    this.rateLimitTracking.delete(tenantId);
    this.auditLoggers.delete(tenantId);
    this.metricsCollectors.delete(tenantId);
  }

  /**
   * Set tenant-specific audit logger
   */
  setAuditLogger(tenantId: string, logger: IAuditLogger): void {
    this.validateTenantExists(tenantId);
    this.auditLoggers.set(tenantId, logger);
  }

  /**
   * Get tenant-specific audit logger
   */
  getAuditLogger(tenantId: string): IAuditLogger | undefined {
    return this.auditLoggers.get(tenantId);
  }

  /**
   * Set tenant-specific metrics collector
   */
  setMetricsCollector(tenantId: string, collector: IMetricsCollector): void {
    this.validateTenantExists(tenantId);
    this.metricsCollectors.set(tenantId, collector);
  }

  /**
   * Get tenant-specific metrics collector
   */
  getMetricsCollector(tenantId: string): IMetricsCollector | undefined {
    return this.metricsCollectors.get(tenantId);
  }

  /**
   * Get aggregate statistics across all tenants
   */
  getAggregateStats(): {
    totalTenants: number;
    activeTenants: number;
    trialTenants: number;
    suspendedTenants: number;
    totalRequestsThisMonth: number;
    totalTextProcessedThisMonth: number;
    totalPiiDetectedThisMonth: number;
  } {
    const tenants = Array.from(this.tenants.values());
    const usages = Array.from(this.usage.values());

    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      trialTenants: tenants.filter(t => t.status === 'trial').length,
      suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
      totalRequestsThisMonth: usages.reduce((sum, u) => sum + u.requestsThisMonth, 0),
      totalTextProcessedThisMonth: usages.reduce((sum, u) => sum + u.textProcessedThisMonth, 0),
      totalPiiDetectedThisMonth: usages.reduce((sum, u) => sum + u.piiDetectedThisMonth, 0)
    };
  }

  /**
   * Validate tenant exists
   */
  private validateTenantExists(tenantId: string): void {
    if (!this.tenants.has(tenantId)) {
      throw new TenantNotFoundError(tenantId);
    }
  }

  /**
   * Export tenant configuration as JSON
   */
  exportTenantConfig(tenantId: string): string {
    const config = this.getTenantConfig(tenantId);
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import tenant configuration from JSON
   */
  importTenantConfig(json: string): TenantConfig {
    const config = JSON.parse(json) as TenantConfig;

    // Validate required fields
    if (!config.tenantId || !config.name || !config.status) {
      throw new Error('Invalid tenant configuration: missing required fields');
    }

    // Register or update tenant
    if (this.tenants.has(config.tenantId)) {
      return this.updateTenant(config.tenantId, config);
    } else {
      return this.registerTenant(config);
    }
  }
}

/**
 * Create a tenant manager instance
 */
export function createTenantManager(): TenantManager {
  return new TenantManager();
}

/**
 * Default tenant quotas for different tiers
 */
export const DEFAULT_TIER_QUOTAS = {
  free: {
    maxRequestsPerMonth: 1000,
    maxTextLength: 10000,
    maxPatterns: 10,
    maxAuditLogs: 100,
    rateLimit: 10 // per minute
  },
  starter: {
    maxRequestsPerMonth: 10000,
    maxTextLength: 50000,
    maxPatterns: 50,
    maxAuditLogs: 1000,
    rateLimit: 50
  },
  professional: {
    maxRequestsPerMonth: 100000,
    maxTextLength: 100000,
    maxPatterns: 200,
    maxAuditLogs: 10000,
    rateLimit: 200
  },
  enterprise: {
    // No limits for enterprise
    maxRequestsPerMonth: undefined,
    maxTextLength: undefined,
    maxPatterns: undefined,
    maxAuditLogs: undefined,
    rateLimit: undefined
  }
} as const;
