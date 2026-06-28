/**
 * @openredaction/api - REST API server and enterprise features for OpenRedaction
 *
 * Provides HTTP servers, multi-tenancy, persistent audit logging, webhooks,
 * and role-based access control on top of @openredaction/core.
 *
 * @packageDocumentation
 */

// REST API Server
export { APIServer, createAPIServer } from "./APIServer";
export type { APIServerConfig, APIRequest, APIResponse } from "./APIServer";

// Prometheus metrics server
export { PrometheusServer, createPrometheusServer } from "./PrometheusServer";
export type { PrometheusServerOptions } from "./PrometheusServer";

// Persistent audit logging
export {
  PersistentAuditLogger,
  createPersistentAuditLogger,
} from "./PersistentAuditLogger";
export type {
  AuditBackend,
  AuditDatabaseConfig,
  RetentionPolicy,
  PersistentAuditLoggerOptions,
  HashedAuditLogEntry,
  IAuditDatabaseAdapter,
  AuditQueryFilter,
} from "./PersistentAuditLogger";

// Multi-tenancy
export {
  TenantManager,
  createTenantManager,
  TenantQuotaExceededError,
  TenantNotFoundError,
  TenantSuspendedError,
  DEFAULT_TIER_QUOTAS,
} from "./tenancy/TenantManager";
export type {
  TenantConfig,
  TenantQuotas,
  TenantUsage,
} from "./tenancy/TenantManager";

// Webhooks
export {
  WebhookManager,
  createWebhookManager,
  verifyWebhookSignature,
} from "./webhooks/WebhookManager";
export type {
  WebhookEventType,
  WebhookEvent,
  WebhookConfig,
  WebhookDeliveryStatus,
  WebhookDelivery,
  WebhookStats,
} from "./webhooks/WebhookManager";

// RBAC (re-exported from @openredaction/core for convenience)
export {
  RBACManager,
  createRBACManager,
  ADMIN_ROLE,
  ANALYST_ROLE,
  OPERATOR_ROLE,
  VIEWER_ROLE,
  ALL_PERMISSIONS,
  getPredefinedRole,
  createCustomRole,
} from "@openredaction/core";
