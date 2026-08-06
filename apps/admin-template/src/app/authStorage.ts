import { AppRole, getDefaultRoleForEmail, isAppRole } from './rbac';

export interface AuthSession {
  email: string;
  loginAt: string;
  role: AppRole;
}

const SESSION_STORAGE_KEY = 'admin-template.session';
const PERSISTED_SESSION_STORAGE_KEY = 'admin-template.persisted-session';
const THEME_STORAGE_KEY = 'admin-template.theme';
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'admin-template.sidebar-collapsed';
const SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY = 'admin-template.sidebar-expanded-groups';

function parseSession(value: string | null): AuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AuthSession>;

    if (typeof parsed.email !== 'string' || typeof parsed.loginAt !== 'string') {
      return null;
    }

    const resolvedRole: AppRole = isAppRole(parsed.role ?? '')
      ? (parsed.role as AppRole)
      : getDefaultRoleForEmail(parsed.email);

    return {
      email: parsed.email,
      loginAt: parsed.loginAt,
      role: resolvedRole,
    };
  } catch {
    return null;
  }
}

export function readStoredSession(): AuthSession | null {
  return (
    parseSession(localStorage.getItem(PERSISTED_SESSION_STORAGE_KEY)) ??
    parseSession(sessionStorage.getItem(SESSION_STORAGE_KEY))
  );
}

export function persistSession(session: AuthSession, rememberMe: boolean): void {
  const serialized = JSON.stringify(session);

  if (rememberMe) {
    localStorage.setItem(PERSISTED_SESSION_STORAGE_KEY, serialized);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
  localStorage.removeItem(PERSISTED_SESSION_STORAGE_KEY);
}

export function clearStoredSession(): void {
  localStorage.removeItem(PERSISTED_SESSION_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export function readStoredTheme(): boolean {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
}

export function persistTheme(isDarkMode: boolean): void {
  localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
}

export function readStoredSidebarCollapsed(): boolean {
  return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
}

export function persistSidebarCollapsed(collapsed: boolean): void {
  localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, collapsed ? 'true' : 'false');
}

export function readStoredSidebarExpandedGroups(fallback: string[]): string[] {
  const value = localStorage.getItem(SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY);

  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed) || parsed.some((group) => typeof group !== 'string')) {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export function persistSidebarExpandedGroups(groups: string[]): void {
  localStorage.setItem(SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY, JSON.stringify(groups));
}
