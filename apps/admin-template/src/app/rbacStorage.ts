import {
  AppPermission,
  AppRole,
  DEFAULT_ROLE_DEFINITIONS,
  APP_ROLES,
  isAppRole,
} from './rbac';

export interface DirectoryUser {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
}

export interface RolePolicy {
  role: AppRole;
  permissions: AppPermission[];
}

export interface AuditEntry {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
  category: 'user' | 'product' | 'order' | 'system' | 'payment';
  status: 'success' | 'pending' | 'failed';
}

const USERS_STORAGE_KEY = 'admin-template.users';
const ROLE_POLICIES_STORAGE_KEY = 'admin-template.role-policies';
const AUDIT_STORAGE_KEY = 'admin-template.audit-log';

const DEFAULT_USERS: DirectoryUser[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Support', status: 'Active', joinDate: '2024-02-20' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Analyst', status: 'Active', joinDate: '2024-03-10' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Support', status: 'Inactive', joinDate: '2024-04-05' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'Billing Manager', status: 'Active', joinDate: '2024-05-12' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Admin', status: 'Active', joinDate: '2024-06-18' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Support', status: 'Suspended', joinDate: '2024-07-22' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'Analyst', status: 'Active', joinDate: '2024-08-09' },
  { id: 9, name: 'Ivy Martinez', email: 'ivy@example.com', role: 'Billing Manager', status: 'Inactive', joinDate: '2024-09-14' },
  { id: 10, name: 'Jack Anderson', email: 'jack@example.com', role: 'Support', status: 'Active', joinDate: '2024-10-21' },
  { id: 11, name: 'Kelly White', email: 'kelly@example.com', role: 'Owner', status: 'Active', joinDate: '2024-11-03' },
  { id: 12, name: 'Leo Harris', email: 'leo@example.com', role: 'Admin', status: 'Active', joinDate: '2024-12-11' },
];

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isValidPermissionList(value: unknown): value is AppPermission[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function getDefaultRolePolicies(): RolePolicy[] {
  return APP_ROLES.map((role) => ({
    role,
    permissions: [...DEFAULT_ROLE_DEFINITIONS[role].permissions],
  }));
}

export function readStoredUsers(): DirectoryUser[] {
  const parsed = parseJson<DirectoryUser[]>(localStorage.getItem(USERS_STORAGE_KEY), DEFAULT_USERS);

  if (!Array.isArray(parsed)) {
    return DEFAULT_USERS;
  }

  const validUsers = parsed.filter(
    (user) =>
      user &&
      typeof user.id === 'number' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.joinDate === 'string' &&
      isAppRole(user.role) &&
      ['Active', 'Inactive', 'Suspended'].includes(user.status)
  );

  return validUsers.length > 0 ? validUsers : DEFAULT_USERS;
}

export function persistUsers(users: DirectoryUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function readStoredRolePolicies(): RolePolicy[] {
  const defaults = getDefaultRolePolicies();
  const parsed = parseJson<RolePolicy[]>(localStorage.getItem(ROLE_POLICIES_STORAGE_KEY), defaults);

  if (!Array.isArray(parsed)) {
    return defaults;
  }

  return defaults.map((defaultPolicy) => {
    const storedPolicy = parsed.find((policy) => policy?.role === defaultPolicy.role);

    if (!storedPolicy || !isValidPermissionList(storedPolicy.permissions)) {
      return defaultPolicy;
    }

    return {
      role: defaultPolicy.role,
      permissions: storedPolicy.permissions.filter((permission) => typeof permission === 'string') as AppPermission[],
    };
  });
}

export function persistRolePolicies(policies: RolePolicy[]): void {
  localStorage.setItem(ROLE_POLICIES_STORAGE_KEY, JSON.stringify(policies));
}

export function readStoredAuditEntries(): AuditEntry[] {
  const parsed = parseJson<AuditEntry[]>(localStorage.getItem(AUDIT_STORAGE_KEY), []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(
    (entry) =>
      entry &&
      typeof entry.id === 'number' &&
      typeof entry.user === 'string' &&
      typeof entry.action === 'string' &&
      typeof entry.description === 'string' &&
      typeof entry.timestamp === 'string' &&
      ['user', 'product', 'order', 'system', 'payment'].includes(entry.category) &&
      ['success', 'pending', 'failed'].includes(entry.status)
  );
}

export function appendAuditEntry(entry: Omit<AuditEntry, 'id'>): void {
  const currentEntries = readStoredAuditEntries();
  const nextId = currentEntries.length > 0 ? Math.max(...currentEntries.map((item) => item.id)) + 1 : 1;
  const nextEntries = [{ ...entry, id: nextId }, ...currentEntries].slice(0, 25);
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(nextEntries));
}
