import { useState, useCallback } from 'react';
import { EmailNotification, NotificationType, NotificationPreference } from '../types/notification';
import {
  readNotifications,
  persistNotifications,
  addNotification,
  updateNotificationStatus,
  saveNotificationPreferences,
  getOrCreatePreferences,
  getNotificationStats,
} from '../utils/notificationStorage';
import { createNotificationFromTemplate } from '../utils/notificationTemplates';

export const useNotifications = (userId: string, userEmail: string) => {
  const [notifications, setNotifications] = useState<EmailNotification[]>(() =>
    readNotifications()
  );
  const [preferences, setPreferences] = useState<NotificationPreference>(() =>
    getOrCreatePreferences(userId, userEmail)
  );

  const sendNotification = useCallback(
    (
      type: NotificationType,
      variables: Record<string, any>,
      recipientEmail?: string
    ) => {
      try {
        const notification = createNotificationFromTemplate(
          type,
          userEmail.split('@')[0],
          recipientEmail || userEmail,
          variables
        );

        const added = addNotification(notification);
        setNotifications((prev) => [...prev, added]);

        // Simulate sending email (in real app, this would call backend API)
        setTimeout(() => {
          updateNotificationStatus(added.id, 'sent');
          setNotifications((prev) =>
            prev.map((n) => (n.id === added.id ? { ...n, status: 'sent' } : n))
          );
        }, 500);

        return added;
      } catch (error) {
        console.error('Failed to send notification:', error);
        return null;
      }
    },
    [userEmail]
  );

  const updatePreferences = useCallback((newPrefs: NotificationPreference) => {
    saveNotificationPreferences(newPrefs);
    setPreferences(newPrefs);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    persistNotifications(updated);
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    persistNotifications([]);
  }, []);

  const getStats = useCallback(() => {
    return getNotificationStats();
  }, []);

  return {
    notifications,
    preferences,
    sendNotification,
    updatePreferences,
    deleteNotification,
    clearNotifications,
    getStats,
  };
};
