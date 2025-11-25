/**
 * RBAC Manager for role-based access control
 */

import type { Role, Permission, IRBACManager, PIIPattern } from '../types';
import { ADMIN_ROLE } from './roles';

/**
 * Default RBAC Manager implementation
 * Provides role-based permission checking and pattern filtering
 */
export class RBACManager implements IRBACManager {
  private role: Role;

  constructor(role: Role = ADMIN_ROLE) {
    this.role = role;
  }

  /**
   * Check if current role has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return this.role.permissions.includes(permission);
  }

  /**
   * Check if current role has all specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Check if current role has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Get current role
   */
  getRole(): Role {
    return { ...this.role };
  }

  /**
   * Set role (updates permissions)
   */
  setRole(role: Role): void {
    this.role = role;
  }

  /**
   * Get all permissions for current role
   */
  getPermissions(): Permission[] {
    return [...this.role.permissions];
  }

  /**
   * Filter patterns based on read permissions
   * Returns empty array if user lacks pattern:read permission
   */
  filterPatterns(patterns: PIIPattern[]): PIIPattern[] {
    if (!this.hasPermission('pattern:read')) {
      return [];
    }
    return patterns;
  }
}

/**
 * Create RBAC manager with predefined or custom role
 */
export function createRBACManager(role: Role): RBACManager {
  return new RBACManager(role);
}
