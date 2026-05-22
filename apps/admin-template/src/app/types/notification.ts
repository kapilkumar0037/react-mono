/**
 * Email Notification Types and Interfaces
 */

export enum NotificationType {
  // Critical Alerts
  CRITICAL_ACTION = 'CRITICAL_ACTION',
  BULK_DELETE_WARNING = 'BULK_DELETE_WARNING',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  
  // Data Operations
  BULK_EXPORT_COMPLETE = 'BULK_EXPORT_COMPLETE',
  DATA_IMPORT_FAILED = 'DATA_IMPORT_FAILED',
  
  // Compliance
  AUDIT_THRESHOLD_REACHED = 'AUDIT_THRESHOLD_REACHED',
  COMPLIANCE_ALERT = 'COMPLIANCE_ALERT',
  
  // System
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SCHEDULED_REPORT = 'SCHEDULED_REPORT',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface EmailNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  recipient: string;
  recipientEmail: string;
  subject: string;
  message: string;
  htmlContent?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sentAt?: number;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  subject: string;
  plainText: string;
  htmlTemplate: string;
  variables: string[]; // Variable names like {{userName}}, {{action}}, etc.
}

export interface NotificationPreference {
  userId: string;
  email: string;
  notificationTypes: Partial<Record<NotificationType, boolean>>;
  criticalAlertsOnly: boolean;
  digestMode: 'instant' | 'daily' | 'weekly' | 'off';
  unsubscribeToken: string;
  lastDigestSent?: number;
}

export interface NotificationSettings {
  smtpServer: string;
  smtpPort: number;
  senderEmail: string;
  senderName: string;
  requiresAuth: boolean;
  username?: string;
  password?: string;
  useSSL: boolean;
  useTLS: boolean;
}
