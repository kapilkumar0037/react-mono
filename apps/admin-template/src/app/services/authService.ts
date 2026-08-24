/**
 * Authentication Service
 * Manages login, logout, and session state with user preferences
 */

import { AuthSession, clearStoredSession, persistSession, readStoredSession } from '../authStorage';
import { clearUserPreferences } from './userPreferencesService';
import { AppRole } from '../rbac';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: AppRole;
}

export interface AuthState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initialize auth state from stored session
 */
export function initializeAuth(): AuthState {
  const session = readStoredSession();
  
  return {
    session,
    isAuthenticated: !!session,
    isLoading: false,
    error: null,
  };
}

/**
 * Perform login (mock implementation - replace with real API call)
 */
export async function login(credentials: LoginRequest): Promise<AuthState> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (!credentials.email.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Create session
    const session: AuthSession = {
      email: credentials.email,
      loginAt: new Date().toISOString(),
      role: credentials.role ?? 'Support',
    };

    // Persist session
    persistSession(session, credentials.rememberMe ?? false);

    return {
      session,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    
    return {
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: errorMessage,
    };
  }
}

/**
 * Perform logout and clear all user data
 */
export function logout(email?: string): AuthState {
  // Clear session
  clearStoredSession();

  // Clear user preferences
  if (email) {
    clearUserPreferences(email);
  }

  return {
    session: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
}

/**
 * Refresh session (e.g., on app startup)
 */
export function refreshSession(): AuthState {
  return initializeAuth();
}

/**
 * Check if session is still valid (mock - replace with real API call)
 */
export async function validateSession(session: AuthSession): Promise<boolean> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real app, validate with backend
    // For now, just check if session exists and isn't too old
    const sessionAge = Date.now() - new Date(session.loginAt).getTime();
    const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours

    return sessionAge < MAX_SESSION_AGE;
  } catch {
    return false;
  }
}

export default {
  initializeAuth,
  login,
  logout,
  refreshSession,
  validateSession,
};
