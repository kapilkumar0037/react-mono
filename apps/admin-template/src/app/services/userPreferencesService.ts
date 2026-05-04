/**
 * User Preferences Service
 * Persists user preferences to localStorage including:
 * - Theme mode (light/dark)
 * - Sidebar state (collapsed/expanded)
 * - Sidebar expanded groups
 * - Custom settings per user
 */

export interface UserPreferences {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  sidebarExpandedGroups: string[];
  tablePageSize: number;
  defaultDateRange: 'today' | 'week' | 'month' | 'year';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  sidebarCollapsed: false,
  sidebarExpandedGroups: ['Dashboard', 'Management'],
  tablePageSize: 15,
  defaultDateRange: 'month',
};

const PREFERENCES_STORAGE_KEY = 'admin-template.user-preferences';

/**
 * Read user preferences from localStorage
 */
export function readUserPreferences(email?: string): UserPreferences {
  try {
    const key = email ? `${PREFERENCES_STORAGE_KEY}.${email}` : PREFERENCES_STORAGE_KEY;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return { ...DEFAULT_PREFERENCES };
    }

    const parsed = JSON.parse(stored);
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      sidebarCollapsed: typeof parsed.sidebarCollapsed === 'boolean' ? parsed.sidebarCollapsed : DEFAULT_PREFERENCES.sidebarCollapsed,
      sidebarExpandedGroups: Array.isArray(parsed.sidebarExpandedGroups) ? parsed.sidebarExpandedGroups : DEFAULT_PREFERENCES.sidebarExpandedGroups,
      tablePageSize: typeof parsed.tablePageSize === 'number' ? parsed.tablePageSize : DEFAULT_PREFERENCES.tablePageSize,
      defaultDateRange: ['today', 'week', 'month', 'year'].includes(parsed.defaultDateRange) ? parsed.defaultDateRange : DEFAULT_PREFERENCES.defaultDateRange,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Persist user preferences to localStorage
 */
export function persistUserPreferences(preferences: UserPreferences, email?: string): void {
  try {
    const key = email ? `${PREFERENCES_STORAGE_KEY}.${email}` : PREFERENCES_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to persist user preferences:', error);
  }
}

/**
 * Update a single preference
 */
export function updateUserPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K],
  email?: string
): UserPreferences {
  const current = readUserPreferences(email);
  const updated = { ...current, [key]: value };
  persistUserPreferences(updated, email);
  return updated;
}

/**
 * Clear all preferences for a user
 */
export function clearUserPreferences(email?: string): void {
  const key = email ? `${PREFERENCES_STORAGE_KEY}.${email}` : PREFERENCES_STORAGE_KEY;
  localStorage.removeItem(key);
}

export default {
  readUserPreferences,
  persistUserPreferences,
  updateUserPreference,
  clearUserPreferences,
};
