import { AppPermission, AppRole, DEFAULT_ROLE_DEFINITIONS, RoleDefinition, hasPermission } from './rbac';

export interface AppCommand {
  id: string;
  label: string;
  keywords: string[];
  description: string;
  permission?: AppPermission;
  to?: string;
  section: 'Navigation' | 'Workspace' | 'Account';
}

export const APP_COMMANDS: AppCommand[] = [
  {
    id: 'nav-dashboard',
    label: 'Open Dashboard',
    description: 'Go to the workspace overview.',
    keywords: ['overview', 'home', 'dashboard'],
    permission: 'dashboard.view',
    to: '/',
    section: 'Navigation',
  },
  {
    id: 'nav-orders',
    label: 'Open Orders',
    description: 'Review active and recent orders.',
    keywords: ['orders', 'sales', 'purchases'],
    permission: 'orders.view',
    to: '/orders',
    section: 'Navigation',
  },
  {
    id: 'nav-inventory',
    label: 'Open Inventory',
    description: 'Inspect stock levels and SKUs.',
    keywords: ['inventory', 'stock', 'warehouse'],
    permission: 'inventory.view',
    to: '/inventory',
    section: 'Navigation',
  },
  {
    id: 'nav-billing',
    label: 'Open Billing',
    description: 'Manage subscriptions and invoices.',
    keywords: ['billing', 'subscriptions', 'finance', 'invoices'],
    permission: 'billing.view',
    to: '/billing-subscriptions',
    section: 'Navigation',
  },
  {
    id: 'nav-customers',
    label: 'Open Customers',
    description: 'Review customer accounts and lifecycle.',
    keywords: ['customers', 'accounts', 'crm'],
    permission: 'customers.view',
    to: '/customers',
    section: 'Navigation',
  },
  {
    id: 'nav-support',
    label: 'Open Support Tickets',
    description: 'Jump into service operations.',
    keywords: ['support', 'tickets', 'helpdesk'],
    permission: 'support.view',
    to: '/support-tickets',
    section: 'Navigation',
  },
  {
    id: 'nav-users',
    label: 'Open Users',
    description: 'Manage team members and roles.',
    keywords: ['users', 'team', 'members'],
    permission: 'users.view',
    to: '/users',
    section: 'Navigation',
  },
  {
    id: 'action-add-user',
    label: 'Add User',
    description: 'Open the user form and invite a teammate.',
    keywords: ['add user', 'invite', 'team member', 'create user'],
    permission: 'users.manage',
    to: '/users?action=add-user',
    section: 'Workspace',
  },
  {
    id: 'nav-reports',
    label: 'Open Reports',
    description: 'Inspect performance and exports.',
    keywords: ['reports', 'analytics', 'metrics'],
    permission: 'reports.view',
    to: '/reports',
    section: 'Navigation',
  },
  {
    id: 'action-generate-sales-report',
    label: 'Generate Sales Report',
    description: 'Run the current sales report for the selected range.',
    keywords: ['generate report', 'sales report', 'analytics'],
    permission: 'reports.view',
    to: '/reports?tab=sales&action=generate-report',
    section: 'Workspace',
  },
  {
    id: 'action-export-report-csv',
    label: 'Export Report CSV',
    description: 'Export the active report as CSV.',
    keywords: ['export csv', 'download report', 'csv'],
    permission: 'reports.view',
    to: '/reports?tab=sales&action=export-csv',
    section: 'Workspace',
  },
  {
    id: 'nav-activity',
    label: 'Open Activity Log',
    description: 'Review system and team changes.',
    keywords: ['activity', 'audit', 'events'],
    permission: 'activity.view',
    to: '/activity',
    section: 'Navigation',
  },
  {
    id: 'action-create-ticket',
    label: 'Create Support Ticket',
    description: 'Open a new support case and assign it immediately.',
    keywords: ['new ticket', 'create ticket', 'support case'],
    permission: 'support.view',
    to: '/support-tickets?action=create-ticket',
    section: 'Workspace',
  },
  {
    id: 'nav-settings-profile',
    label: 'Open Profile Settings',
    description: 'Edit profile details and account information.',
    keywords: ['profile', 'settings', 'account'],
    permission: 'settings.view',
    to: '/settings?tab=profile',
    section: 'Account',
  },
  {
    id: 'nav-settings-organization',
    label: 'Open Organization Settings',
    description: 'Configure workspace identity and operations.',
    keywords: ['organization', 'workspace', 'settings'],
    permission: 'settings.view',
    to: '/settings?tab=organization',
    section: 'Workspace',
  },
  {
    id: 'nav-access-control',
    label: 'Open Access Control',
    description: 'Adjust roles and permission policies.',
    keywords: ['access', 'permissions', 'roles', 'rbac'],
    permission: 'rbac.manage',
    to: '/access-control',
    section: 'Workspace',
  },
  {
    id: 'action-create-backup',
    label: 'Create Backup',
    description: 'Start a manual full backup and add it to history.',
    keywords: ['backup', 'manual backup', 'recovery'],
    permission: 'backup.manage',
    to: '/backup-recovery?action=create-backup',
    section: 'Workspace',
  },
];

export function getAvailableCommands(
  currentRole: AppRole,
  definitions: Record<AppRole, RoleDefinition> = DEFAULT_ROLE_DEFINITIONS
): AppCommand[] {
  return APP_COMMANDS.filter((command) =>
    command.permission ? hasPermission(currentRole, command.permission, definitions) : true
  );
}
