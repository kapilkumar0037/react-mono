import React from 'react';
import { Card } from '@react-mono/ui-controls';
import { useNotifications } from './hooks/useNotifications';
import { NotificationCenter } from './components/NotificationCenter';

interface NotificationCenterPageProps {
  isDarkMode?: boolean;
  currentUserEmail?: string;
}

const NotificationCenterPage: React.FC<NotificationCenterPageProps> = ({
  isDarkMode = false,
  currentUserEmail = 'user@example.com',
}) => {
  const userId = currentUserEmail.split('@')[0];
  const {
    notifications,
    preferences,
    updatePreferences,
    deleteNotification,
    clearNotifications,
  } = useNotifications(userId, currentUserEmail);

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notification Center
        </h1>
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage email notifications and communication preferences
        </p>
      </div>

      {/* Preferences */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Notification Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Digest Mode
              </label>
              <select
                value={preferences.digestMode}
                onChange={(e) =>
                  updatePreferences({
                    ...preferences,
                    digestMode: e.target.value as 'instant' | 'daily' | 'weekly' | 'off',
                  })
                }
                className={`rounded-lg border px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="instant">Instant Notifications</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="off">No Notifications</option>
              </select>
              <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                How often would you like to receive notifications?
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="critical-only"
                checked={preferences.criticalAlertsOnly}
                onChange={(e) =>
                  updatePreferences({
                    ...preferences,
                    criticalAlertsOnly: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded"
              />
              <label
                htmlFor="critical-only"
                className={`text-sm font-medium cursor-pointer ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Critical Alerts Only
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Notification Types
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(preferences.notificationTypes).map(([type, enabled]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled !== false}
                    onChange={(e) =>
                      updatePreferences({
                        ...preferences,
                        notificationTypes: {
                          ...preferences.notificationTypes,
                          [type]: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {type.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onDelete={deleteNotification}
        onClearAll={clearNotifications}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default NotificationCenterPage;
