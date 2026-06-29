/**
 * Multi-tenancy module
 */

export type {
  TenantConfig,
  TenantQuotas,
  TenantUsage,
} from "./TenantManager";
export {
  createTenantManager,
  DEFAULT_TIER_QUOTAS,
  TenantManager,
  TenantNotFoundError,
  TenantQuotaExceededError,
  TenantSuspendedError,
} from "./TenantManager";
