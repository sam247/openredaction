/**
 * Multi-tenancy module
 */

export {
  TenantManager,
  createTenantManager,
  TenantQuotaExceededError,
  TenantNotFoundError,
  TenantSuspendedError,
  DEFAULT_TIER_QUOTAS
} from './TenantManager';
export type {
  TenantConfig,
  TenantQuotas,
  TenantUsage
} from './TenantManager';
