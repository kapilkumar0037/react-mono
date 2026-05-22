import { EmailNotification, NotificationPreference, NotificationType } from '../types/notification';

const NOTIFICATIONS_KEY = 'email-notifications';
const PREFERENCES_KEY = 'notification-preferences';

/**
 * Read all notifications from localStorage
 */
export const readNotifications = (): EmailNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read notifications:', error);
    return [];
  }
};

/**
 * Persist notifications to localStorage
 */
export const persistNotifications = (notifications: EmailNotification[]): void => {
  try {
    // Keep only last 500 notifications to prevent storage bloat
    const toStore = notifications.slice(-500);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to persist notifications:', error);
  }
};

/**
 * Add a new notification
 */
export const addNotification = (notification: EmailNotification): EmailNotification => {
  const notifications = readNotifications();
  notifications.push(notification);
  persistNotifications(notifications);
  return notification;
};

/**
 * Update notification status
 */
export const updateNotificationStatus = (
  id: string,
  status: EmailNotification['status'],
  errorMessage?: string
): EmailNotification | null => {
  const notifications = readNotifications();
  const notification = notifications.find((n) => n.id === id);

  if (notification) {
    notification.status = status;
    notification.sentAt = Date.now();
    if (errorMessage) {
      notification.errorMessage = errorMessage;
      notification.retryCount++;
    }
    persistNotifications(notifications);
    return notification;
  }

  return null;
};

/**
 * Get notifications by status
 */
export const getNotificationsByStatus = (
  status: EmailNotification['status']
): EmailNotification[] => {
  const notifications = readNotifications();
  return notifications.filter((n) => n.status === status);
};

/**
 * Get pending notifications for retry
 */
export const getPendingNotificationsForRetry = (maxRetries: number = 3): EmailNotification[] => {
  const notifications = readNotifications();
  return notifications.filter(
    (n) => n.status === 'pending' || (n.status === 'failed' && n.retryCount < maxRetries)
  );
};

/**
 * Get notification preferences for user
 */
export const getNotificationPreferences = (userId: string): NotificationPreference | null => {
  try {
    const stored = localStorage.getItem(`${PREFERENCES_KEY}:${userId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to read preferences:', error);
    return null;
  }
};

/**
 * Save notification preferences for user
 */
export const saveNotificationPreferences = (preferences: NotificationPreference): void => {
  try {
    localStorage.setItem(`${PREFERENCES_KEY}:${preferences.userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

/**
 * Create default preferences for user
 */
export const createDefaultPreferences = (userId: string, email: string): NotificationPreference => {
  const preferences: NotificationPreference = {
    userId,
    email,
    notificationTypes: {
      [NotificationType.CRITICAL_ACTION]: true,
      [NotificationType.BULK_DELETE_WARNING]: true,
      [NotificationType.PERMISSION_DENIED]: true,
      [NotificationType.USER_CREATED]: true,
      [NotificationType.USER_DELETED]: true,
      [NotificationType.USER_ROLE_CHANGED]: true,
      [NotificationType.BULK_EXPORT_COMPLETE]: true,
      [NotificationType.DATA_IMPORT_FAILED]: true,
      [NotificationType.COMPLIANCE_ALERT]: true,
    },
    criticalAlertsOnly: false,
    digestMode: 'instant',
    unsubscribeToken: `unsub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  saveNotificationPreferences(preferences);
  return preferences;
};

/**
 * Get or create preferences for user
 */
export const getOrCreatePreferences = (userId: string, email: string): NotificationPreference => {
  let prefs = getNotificationPreferences(userId);
  if (!prefs) {
    prefs = createDefaultPreferences(userId, email);
  }
  return prefs;
};

/**
 * Clear old notifications
 */
export const clearOldNotifications = (daysOld: number = 30): number => {
  const notifications = readNotifications();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = notifications.filter((n) => n.timestamp > cutoffTime);
  const removedCount = notifications.length - filtered.length;
  persistNotifications(filtered);
  return removedCount;
};

/**
 * Get notification statistics
 */
export const getNotificationStats = () => {
  const notifications = readNotifications();

  return {
    total: notifications.length,
    pending: notifications.filter((n) => n.status === 'pending').length,
    sent: notifications.filter((n) => n.status === 'sent').length,
    failed: notifications.filter((n) => n.status === 'failed').length,
    bounced: notifications.filter((n) => n.status === 'bounced').length,
    critical: notifications.filter((n) => n.priority === 'CRITICAL').length,
  };
};
