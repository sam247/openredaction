/**
 * RBAC (Role-Based Access Control) module
 */

export type { IRBACManager, Permission, Role, RoleName } from "../types";
export { createRBACManager, RBACManager } from "./RBACManager";
export {
  ADMIN_ROLE,
  ALL_PERMISSIONS,
  ANALYST_ROLE,
  createCustomRole,
  getPredefinedRole,
  OPERATOR_ROLE,
  VIEWER_ROLE,
} from "./roles";
