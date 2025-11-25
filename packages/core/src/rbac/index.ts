/**
 * RBAC (Role-Based Access Control) module
 */

export { RBACManager, createRBACManager } from './RBACManager';
export {
  ADMIN_ROLE,
  ANALYST_ROLE,
  OPERATOR_ROLE,
  VIEWER_ROLE,
  ALL_PERMISSIONS,
  getPredefinedRole,
  createCustomRole
} from './roles';
export type { Role, Permission, RoleName, IRBACManager } from '../types';
