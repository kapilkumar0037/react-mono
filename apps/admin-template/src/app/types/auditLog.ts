/**
 * Audit Log Types and Interfaces
 */

export enum AuditActionType {
  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_STATUS_CHANGED = 'USER_STATUS_CHANGED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',

  // Data Operations
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_IMPORTED = 'DATA_IMPORTED',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',

  // Access Control
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',

  // Settings
  SETTING_CHANGED = 'SETTING_CHANGED',
  FILTER_SAVED = 'FILTER_SAVED',
  REPORT_GENERATED = 'REPORT_GENERATED',

  // System
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AuditLog {
  id: string;
  timestamp: number; // Unix timestamp
  actionType: AuditActionType;
  severity: AuditSeverity;
  userId: string;
  userName: string;
  userEmail: string;
  entityType: string; // 'User', 'Order', 'Customer', etc.
  entityId?: string;
  entityName?: string;
  action: string; // Human-readable action description
  description: string;
  changes?: Record<string, { before: any; after: any }>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AuditFilter {
  startDate?: number;
  endDate?: number;
  actionTypes?: AuditActionType[];
  severity?: AuditSeverity;
  userId?: string;
  entityType?: string;
  status?: 'success' | 'failure';
  searchQuery?: string;
}

export interface AuditSummary {
  totalActions: number;
  successCount: number;
  failureCount: number;
  criticalActions: number;
  uniqueUsers: number;
  dateRange: { start: number; end: number };
  topActions: Array<{ action: string; count: number }>;
  topUsers: Array<{ userId: string; userName: string; count: number }>;
}
