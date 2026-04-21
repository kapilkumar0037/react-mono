export type AppRole = 'Owner' | 'Admin' | 'Support' | 'Analyst' | 'Billing Manager';

export type AppPermission =
  | 'dashboard.view'
  | 'orders.view'
  | 'inventory.view'
  | 'billing.view'
  | 'integrations.view'
  | 'customers.view'
  | 'returns.view'
  | 'support.view'
  | 'users.view'
  | 'users.manage'
  | 'settings.view'
  | 'reports.view'
  | 'activity.view'
  | 'notifications.view'
  | 'system.view'
  | 'backup.manage'
  | 'apiKeys.manage'
  | 'rbac.manage';

export interface RoleDefinition {
  label: AppRole;
  description: string;
  permissions: AppPermission[];
}

export const APP_ROLES: AppRole[] = ['Owner', 'Admin', 'Support', 'Analyst', 'Billing Manager'];

export const PERMISSION_LABELS: Record<AppPermission, string> = {
  'dashboard.view': 'Dashboard',
  'orders.view': 'Orders',
  'inventory.view': 'Inventory',
  'billing.view': 'Billing and subscriptions',
  'integrations.view': 'Integrations',
  'customers.view': 'Customers',
  'returns.view': 'Returns and refunds',
  'support.view': 'Support tickets',
  'users.view': 'Users',
  'users.manage': 'Manage users',
  'settings.view': 'Settings',
  'reports.view': 'Reports',
  'activity.view': 'Activity log',
  'notifications.view': 'Notifications',
  'system.view': 'System health',
  'backup.manage': 'Backup and recovery',
  'apiKeys.manage': 'API keys',
  'rbac.manage': 'Access control',
};

export const PERMISSION_GROUPS: Array<{ name: string; permissions: AppPermission[] }> = [
  {
    name: 'Operations',
    permissions: [
      'dashboard.view',
      'orders.view',
      'inventory.view',
      'customers.view',
      'returns.view',
      'support.view',
      'integrations.view',
    ],
  },
  {
    name: 'Commercial',
    permissions: ['billing.view', 'reports.view', 'notifications.view'],
  },
  {
    name: 'Administration',
    permissions: [
      'users.view',
      'users.manage',
      'settings.view',
      'activity.view',
      'system.view',
      'backup.manage',
      'apiKeys.manage',
      'rbac.manage',
    ],
  },
];

export const DEFAULT_ROLE_DEFINITIONS: Record<AppRole, RoleDefinition> = {
  Owner: {
    label: 'Owner',
    description: 'Full administrative access across the workspace.',
    permissions: [
      'dashboard.view',
      'orders.view',
      'inventory.view',
      'billing.view',
      'integrations.view',
      'customers.view',
      'returns.view',
      'support.view',
      'users.view',
      'users.manage',
      'settings.view',
      'reports.view',
      'activity.view',
      'notifications.view',
      'system.view',
      'backup.manage',
      'apiKeys.manage',
      'rbac.manage',
    ],
  },
  Admin: {
    label: 'Admin',
    description: 'Runs day-to-day operations and team management.',
    permissions: [
      'dashboard.view',
      'orders.view',
      'inventory.view',
      'billing.view',
      'integrations.view',
      'customers.view',
      'returns.view',
      'support.view',
      'users.view',
      'users.manage',
      'settings.view',
      'reports.view',
      'activity.view',
      'notifications.view',
      'system.view',
    ],
  },
  Support: {
    label: 'Support',
    description: 'Handles customers, orders, and service operations.',
    permissions: [
      'dashboard.view',
      'orders.view',
      'customers.view',
      'returns.view',
      'support.view',
      'users.view',
      'activity.view',
      'notifications.view',
    ],
  },
  Analyst: {
    label: 'Analyst',
    description: 'Explores operational performance and reporting.',
    permissions: [
      'dashboard.view',
      'reports.view',
      'customers.view',
      'orders.view',
      'activity.view',
      'notifications.view',
    ],
  },
  'Billing Manager': {
    label: 'Billing Manager',
    description: 'Owns billing operations, subscriptions, and finance reporting.',
    permissions: [
      'dashboard.view',
      'billing.view',
      'customers.view',
      'reports.view',
      'notifications.view',
      'activity.view',
      'settings.view',
    ],
  },
};

export function isAppRole(value: string): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}

export function getDefaultRoleForEmail(email: string): AppRole {
  const normalized = email.trim().toLowerCase();

  if (normalized.startsWith('support')) {
    return 'Support';
  }

  if (normalized.startsWith('analyst')) {
    return 'Analyst';
  }

  if (normalized.startsWith('billing') || normalized.includes('finance')) {
    return 'Billing Manager';
  }

  if (normalized === 'demo@example.com' || normalized.startsWith('owner')) {
    return 'Owner';
  }

  return 'Admin';
}

export function hasPermission(
  role: AppRole,
  permission: AppPermission,
  definitions: Record<AppRole, RoleDefinition> = DEFAULT_ROLE_DEFINITIONS
): boolean {
  return definitions[role].permissions.includes(permission);
}

export function getRoleBadgeClass(role: AppRole): string {
  switch (role) {
    case 'Owner':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    case 'Admin':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'Support':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'Analyst':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
    case 'Billing Manager':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
}
