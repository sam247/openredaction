/**
 * Webhook and Alert System for event-driven notifications
 * Supports HTTP webhooks with retry logic, circuit breaker, and event filtering
 */

import type { DetectionResult } from '../types';

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'pii.detected.high_risk'     // High/critical severity PII detected
  | 'pii.detected.bulk'          // Large number of PII items detected
  | 'pii.processing.failed'      // Processing error occurred
  | 'pii.processing.slow'        // Processing took longer than threshold
  | 'quota.exceeded'             // Tenant quota exceeded
  | 'tenant.suspended'           // Tenant suspended
  | 'audit.tamper_detected'      // Audit log tampering detected
  | 'custom';                    // Custom event

/**
 * Webhook event payload
 */
export interface WebhookEvent {
  /** Event unique ID */
  id: string;
  /** Event type */
  type: WebhookEventType;
  /** Event timestamp (ISO 8601) */
  timestamp: string;
  /** Event severity */
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  /** Event data */
  data: Record<string, unknown>;
  /** Source identifier (e.g., tenant ID) */
  source?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** Webhook unique ID */
  id: string;
  /** Webhook URL to POST events to */
  url: string;
  /** Event types to subscribe to (empty = all events) */
  events?: WebhookEventType[];
  /** Minimum severity to trigger webhook */
  minSeverity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
  /** Secret for HMAC signature (optional but recommended) */
  secret?: string;
  /** Enable webhook (default: true) */
  enabled?: boolean;
  /** Retry configuration */
  retry?: {
    /** Maximum retry attempts (default: 3) */
    maxAttempts?: number;
    /** Initial delay in ms (default: 1000) */
    initialDelay?: number;
    /** Maximum delay in ms (default: 60000) */
    maxDelay?: number;
    /** Backoff multiplier (default: 2) */
    backoffMultiplier?: number;
  };
  /** Timeout in ms (default: 5000) */
  timeout?: number;
  /** Tenant ID (for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Webhook delivery status
 */
export type WebhookDeliveryStatus = 'pending' | 'success' | 'failed' | 'circuit_open';

/**
 * Webhook delivery record
 */
export interface WebhookDelivery {
  /** Delivery ID */
  id: string;
  /** Webhook ID */
  webhookId: string;
  /** Event that was delivered */
  event: WebhookEvent;
  /** Delivery status */
  status: WebhookDeliveryStatus;
  /** HTTP status code */
  statusCode?: number;
  /** Delivery timestamp */
  timestamp: Date;
  /** Attempt number */
  attempt: number;
  /** Error message if failed */
  error?: string;
  /** Response body */
  responseBody?: string;
  /** Delivery duration in ms */
  durationMs?: number;
}

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  /** Current state */
  state: 'closed' | 'open' | 'half_open';
  /** Failure count */
  failureCount: number;
  /** Last failure time */
  lastFailureTime?: Date;
  /** Next retry time (when state is open) */
  nextRetryTime?: Date;
}

/**
 * Webhook statistics
 */
export interface WebhookStats {
  /** Webhook ID */
  webhookId: string;
  /** Total deliveries */
  totalDeliveries: number;
  /** Successful deliveries */
  successfulDeliveries: number;
  /** Failed deliveries */
  failedDeliveries: number;
  /** Average delivery time in ms */
  avgDeliveryTimeMs: number;
  /** Last delivery time */
  lastDeliveryTime?: Date;
  /** Circuit breaker state */
  circuitState: 'closed' | 'open' | 'half_open';
}

/**
 * Webhook Manager
 * Manages webhook subscriptions, delivery, retries, and circuit breaking
 */
export class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private deliveryHistory: WebhookDelivery[] = [];
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private pendingRetries: Map<string, NodeJS.Timeout> = new Map();
  private maxHistorySize: number;

  // Circuit breaker configuration
  private readonly FAILURE_THRESHOLD = 5;
  private readonly RESET_TIMEOUT_MS = 60000; // 1 minute
  // private readonly HALF_OPEN_MAX_REQUESTS = 1; // Reserved for future use

  constructor(options?: { maxHistorySize?: number }) {
    this.maxHistorySize = options?.maxHistorySize ?? 1000;
  }

  /**
   * Register a webhook
   */
  registerWebhook(config: WebhookConfig): void {
    if (this.webhooks.has(config.id)) {
      throw new Error(`Webhook already registered: ${config.id}`);
    }

    // Validate URL
    try {
      new URL(config.url);
    } catch {
      throw new Error(`Invalid webhook URL: ${config.url}`);
    }

    this.webhooks.set(config.id, {
      ...config,
      enabled: config.enabled ?? true,
      retry: {
        maxAttempts: config.retry?.maxAttempts ?? 3,
        initialDelay: config.retry?.initialDelay ?? 1000,
        maxDelay: config.retry?.maxDelay ?? 60000,
        backoffMultiplier: config.retry?.backoffMultiplier ?? 2
      },
      timeout: config.timeout ?? 5000
    });

    // Initialize circuit breaker
    this.circuitBreakers.set(config.id, {
      state: 'closed',
      failureCount: 0
    });
  }

  /**
   * Update webhook configuration
   */
  updateWebhook(id: string, updates: Partial<Omit<WebhookConfig, 'id'>>): void {
    const webhook = this.webhooks.get(id);
    if (!webhook) {
      throw new Error(`Webhook not found: ${id}`);
    }

    this.webhooks.set(id, {
      ...webhook,
      ...updates
    });
  }

  /**
   * Delete webhook
   */
  deleteWebhook(id: string): void {
    this.webhooks.delete(id);
    this.circuitBreakers.delete(id);

    // Cancel any pending retries
    const retry = this.pendingRetries.get(id);
    if (retry) {
      clearTimeout(retry);
      this.pendingRetries.delete(id);
    }
  }

  /**
   * Get webhook configuration
   */
  getWebhook(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }

  /**
   * Get all webhooks
   */
  getAllWebhooks(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }

  /**
   * Emit an event to all subscribed webhooks
   */
  async emitEvent(event: Omit<WebhookEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: WebhookEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...event
    };

    // Find matching webhooks
    const matchingWebhooks = this.findMatchingWebhooks(fullEvent);

    // Deliver to all matching webhooks (parallel)
    await Promise.all(
      matchingWebhooks.map(webhook => this.deliverWebhook(webhook, fullEvent, 1))
    );
  }

  /**
   * Emit high-risk PII detection event
   */
  async emitHighRiskPII(result: DetectionResult, tenantId?: string): Promise<void> {
    const highRiskDetections = result.detections.filter(
      d => d.severity === 'critical' || d.severity === 'high'
    );

    if (highRiskDetections.length === 0) {
      return;
    }

    await this.emitEvent({
      type: 'pii.detected.high_risk',
      severity: 'high',
      data: {
        detectionCount: highRiskDetections.length,
        types: [...new Set(highRiskDetections.map(d => d.type))],
        severities: [...new Set(highRiskDetections.map(d => d.severity))],
        textLength: result.original.length
      },
      source: tenantId
    });
  }

  /**
   * Emit bulk PII detection event
   */
  async emitBulkPII(result: DetectionResult, threshold: number = 10, tenantId?: string): Promise<void> {
    if (result.detections.length < threshold) {
      return;
    }

    await this.emitEvent({
      type: 'pii.detected.bulk',
      severity: 'medium',
      data: {
        detectionCount: result.detections.length,
        types: [...new Set(result.detections.map(d => d.type))],
        textLength: result.original.length
      },
      source: tenantId
    });
  }

  /**
   * Emit processing error event
   */
  async emitProcessingError(error: Error, tenantId?: string): Promise<void> {
    await this.emitEvent({
      type: 'pii.processing.failed',
      severity: 'high',
      data: {
        error: error.message,
        stack: error.stack
      },
      source: tenantId
    });
  }

  /**
   * Emit slow processing event
   */
  async emitSlowProcessing(durationMs: number, threshold: number = 5000, tenantId?: string): Promise<void> {
    if (durationMs < threshold) {
      return;
    }

    await this.emitEvent({
      type: 'pii.processing.slow',
      severity: 'low',
      data: {
        durationMs,
        thresholdMs: threshold
      },
      source: tenantId
    });
  }

  /**
   * Find webhooks that match the event
   */
  private findMatchingWebhooks(event: WebhookEvent): WebhookConfig[] {
    return Array.from(this.webhooks.values()).filter(webhook => {
      // Check if enabled
      if (!webhook.enabled) {
        return false;
      }

      // Check tenant filtering
      if (webhook.tenantId && event.source !== webhook.tenantId) {
        return false;
      }

      // Check event type filtering
      if (webhook.events && webhook.events.length > 0) {
        if (!webhook.events.includes(event.type)) {
          return false;
        }
      }

      // Check severity filtering
      if (webhook.minSeverity) {
        const severityOrder = ['info', 'low', 'medium', 'high', 'critical'];
        const eventSeverityIndex = severityOrder.indexOf(event.severity);
        const minSeverityIndex = severityOrder.indexOf(webhook.minSeverity);

        if (eventSeverityIndex < minSeverityIndex) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Deliver webhook with retry logic
   */
  private async deliverWebhook(
    webhook: WebhookConfig,
    event: WebhookEvent,
    attempt: number
  ): Promise<void> {
    // Check circuit breaker
    const circuitState = this.circuitBreakers.get(webhook.id);
    if (!circuitState) {
      return;
    }

    if (circuitState.state === 'open') {
      // Check if we should move to half-open
      if (circuitState.nextRetryTime && new Date() >= circuitState.nextRetryTime) {
        circuitState.state = 'half_open';
        circuitState.failureCount = 0;
      } else {
        // Circuit is open, skip delivery
        this.recordDelivery({
          id: this.generateId(),
          webhookId: webhook.id,
          event,
          status: 'circuit_open',
          timestamp: new Date(),
          attempt,
          error: 'Circuit breaker is open'
        });
        return;
      }
    }

    const startTime = Date.now();
    const deliveryId = this.generateId();

    try {
      // Make HTTP request
      const response = await this.makeHttpRequest(webhook, event);

      const durationMs = Date.now() - startTime;

      // Record successful delivery
      this.recordDelivery({
        id: deliveryId,
        webhookId: webhook.id,
        event,
        status: 'success',
        statusCode: response.statusCode,
        timestamp: new Date(),
        attempt,
        responseBody: response.body,
        durationMs
      });

      // Reset circuit breaker on success
      if (circuitState.state === 'half_open') {
        circuitState.state = 'closed';
        circuitState.failureCount = 0;
      }
    } catch (error: any) {
      const durationMs = Date.now() - startTime;

      // Record failed delivery
      this.recordDelivery({
        id: deliveryId,
        webhookId: webhook.id,
        event,
        status: 'failed',
        statusCode: error.statusCode,
        timestamp: new Date(),
        attempt,
        error: error.message,
        durationMs
      });

      // Update circuit breaker
      circuitState.failureCount++;
      circuitState.lastFailureTime = new Date();

      if (circuitState.failureCount >= this.FAILURE_THRESHOLD) {
        circuitState.state = 'open';
        circuitState.nextRetryTime = new Date(Date.now() + this.RESET_TIMEOUT_MS);
        console.warn(`[WebhookManager] Circuit breaker opened for webhook ${webhook.id}`);
      }

      // Retry if attempts remaining
      const maxAttempts = webhook.retry!.maxAttempts!;
      if (attempt < maxAttempts) {
        const delay = this.calculateRetryDelay(attempt, webhook.retry!);
        console.log(`[WebhookManager] Retrying webhook ${webhook.id} in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);

        const timeout = setTimeout(() => {
          this.deliverWebhook(webhook, event, attempt + 1).catch(err => {
            console.error(`[WebhookManager] Retry failed for webhook ${webhook.id}:`, err);
          });
          this.pendingRetries.delete(webhook.id);
        }, delay);

        this.pendingRetries.set(webhook.id, timeout);
      }
    }
  }

  /**
   * Make HTTP request to webhook URL
   */
  private async makeHttpRequest(
    webhook: WebhookConfig,
    event: WebhookEvent
  ): Promise<{ statusCode: number; body: string }> {
    try {
      // Try to use fetch (Node 18+) or https module
      let fetch: any;
      try {
        fetch = globalThis.fetch;
      } catch {
        // Fetch not available, use https module (implementation stub)
        throw new Error('[WebhookManager] HTTP client not available. Requires Node 18+ with fetch support.');
      }

      // Calculate HMAC signature if secret provided
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'OpenRedaction-Webhook/1.0',
        ...webhook.headers
      };

      if (webhook.secret) {
        const signature = this.calculateHmacSignature(event, webhook.secret);
        headers['X-Webhook-Signature'] = signature;
        headers['X-Webhook-Signature-Algorithm'] = 'sha256';
      }

      // Add event metadata headers
      headers['X-Event-Id'] = event.id;
      headers['X-Event-Type'] = event.type;
      headers['X-Event-Timestamp'] = event.timestamp;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), webhook.timeout);

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(event),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const body = await response.text();

        if (!response.ok) {
          throw Object.assign(new Error(`HTTP ${response.status}: ${response.statusText}`), {
            statusCode: response.status
          });
        }

        return {
          statusCode: response.status,
          body
        };
      } catch (error: any) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: any) {
      throw Object.assign(new Error(`Webhook delivery failed: ${error.message}`), {
        statusCode: error.statusCode || 0
      });
    }
  }

  /**
   * Calculate HMAC signature for webhook verification
   */
  private calculateHmacSignature(event: WebhookEvent, secret: string): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      const payload = JSON.stringify(event);
      return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    } catch {
      throw new Error('[WebhookManager] Crypto module not available for HMAC signatures');
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number, retryConfig: NonNullable<WebhookConfig['retry']>): number {
    const { initialDelay, maxDelay, backoffMultiplier } = retryConfig;
    const delay = initialDelay! * Math.pow(backoffMultiplier!, attempt - 1);
    return Math.min(delay, maxDelay!);
  }

  /**
   * Record delivery in history
   */
  private recordDelivery(delivery: WebhookDelivery): void {
    this.deliveryHistory.push(delivery);

    // Trim history if too large
    if (this.deliveryHistory.length > this.maxHistorySize) {
      this.deliveryHistory.shift();
    }
  }

  /**
   * Get delivery history for a webhook
   */
  getDeliveryHistory(webhookId: string, limit?: number): WebhookDelivery[] {
    const history = this.deliveryHistory.filter(d => d.webhookId === webhookId);

    if (limit) {
      return history.slice(-limit);
    }

    return history;
  }

  /**
   * Get webhook statistics
   */
  getWebhookStats(webhookId: string): WebhookStats {
    const deliveries = this.deliveryHistory.filter(d => d.webhookId === webhookId);
    const successful = deliveries.filter(d => d.status === 'success');
    const failed = deliveries.filter(d => d.status === 'failed');

    const avgDeliveryTime = deliveries.length > 0
      ? deliveries.reduce((sum, d) => sum + (d.durationMs || 0), 0) / deliveries.length
      : 0;

    const lastDelivery = deliveries.length > 0
      ? deliveries[deliveries.length - 1].timestamp
      : undefined;

    const circuit = this.circuitBreakers.get(webhookId);

    return {
      webhookId,
      totalDeliveries: deliveries.length,
      successfulDeliveries: successful.length,
      failedDeliveries: failed.length,
      avgDeliveryTimeMs: avgDeliveryTime,
      lastDeliveryTime: lastDelivery,
      circuitState: circuit?.state || 'closed'
    };
  }

  /**
   * Get aggregate statistics for all webhooks
   */
  getAggregateStats(): {
    totalWebhooks: number;
    enabledWebhooks: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    avgDeliveryTimeMs: number;
  } {
    const webhooks = Array.from(this.webhooks.values());
    const successful = this.deliveryHistory.filter(d => d.status === 'success');
    const failed = this.deliveryHistory.filter(d => d.status === 'failed');

    const avgDeliveryTime = this.deliveryHistory.length > 0
      ? this.deliveryHistory.reduce((sum, d) => sum + (d.durationMs || 0), 0) / this.deliveryHistory.length
      : 0;

    return {
      totalWebhooks: webhooks.length,
      enabledWebhooks: webhooks.filter(w => w.enabled).length,
      totalDeliveries: this.deliveryHistory.length,
      successfulDeliveries: successful.length,
      failedDeliveries: failed.length,
      avgDeliveryTimeMs: avgDeliveryTime
    };
  }

  /**
   * Clear delivery history
   */
  clearHistory(): void {
    this.deliveryHistory = [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Create a webhook manager instance
 */
export function createWebhookManager(options?: { maxHistorySize?: number }): WebhookManager {
  return new WebhookManager(options);
}

/**
 * Verify webhook HMAC signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
