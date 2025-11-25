/**
 * Predefined RBAC roles with permission sets
 */

import type { Role, Permission } from '../types';

/**
 * All available permissions
 */
export const ALL_PERMISSIONS: Permission[] = [
  'pattern:read',
  'pattern:write',
  'pattern:delete',
  'detection:detect',
  'detection:redact',
  'detection:restore',
  'audit:read',
  'audit:export',
  'audit:delete',
  'metrics:read',
  'metrics:export',
  'metrics:reset',
  'config:read',
  'config:write'
];

/**
 * Admin role - full access to all operations
 */
export const ADMIN_ROLE: Role = {
  name: 'admin',
  description: 'Administrator with full access to all operations',
  permissions: ALL_PERMISSIONS
};

/**
 * Analyst role - can perform analysis and read audit/metrics
 */
export const ANALYST_ROLE: Role = {
  name: 'analyst',
  description: 'Data analyst with detection, audit, and metrics access',
  permissions: [
    'pattern:read',
    'detection:detect',
    'detection:redact',
    'detection:restore',
    'audit:read',
    'audit:export',
    'metrics:read',
    'metrics:export',
    'config:read'
  ]
};

/**
 * Operator role - can perform detections and basic operations
 */
export const OPERATOR_ROLE: Role = {
  name: 'operator',
  description: 'Operator with detection and limited audit/metrics access',
  permissions: [
    'pattern:read',
    'detection:detect',
    'detection:redact',
    'audit:read',
    'metrics:read'
  ]
};

/**
 * Viewer role - read-only access to patterns, audit logs, and metrics
 */
export const VIEWER_ROLE: Role = {
  name: 'viewer',
  description: 'Read-only viewer with no execution permissions',
  permissions: [
    'pattern:read',
    'audit:read',
    'audit:export',
    'metrics:read',
    'metrics:export',
    'config:read'
  ]
};

/**
 * Get predefined role by name
 */
export function getPredefinedRole(roleName: string): Role | undefined {
  switch (roleName.toLowerCase()) {
    case 'admin':
      return ADMIN_ROLE;
    case 'analyst':
      return ANALYST_ROLE;
    case 'operator':
      return OPERATOR_ROLE;
    case 'viewer':
      return VIEWER_ROLE;
    default:
      return undefined;
  }
}

/**
 * Create a custom role with specific permissions
 */
export function createCustomRole(name: string, permissions: Permission[], description?: string): Role {
  return {
    name,
    description: description || `Custom role: ${name}`,
    permissions
  };
}
