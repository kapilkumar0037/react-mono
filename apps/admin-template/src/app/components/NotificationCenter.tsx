import React, { useMemo, useState } from 'react';
import { Card, Badge, Button, Pagination } from '@react-mono/ui-controls';
import { EmailNotification, NotificationType } from '../types/notification';
import { EmptyState } from './EmptyState';

interface NotificationCenterProps {
  notifications: EmailNotification[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isDarkMode?: boolean;
}

const priorityColors = {
  CRITICAL: 'danger',
  HIGH: 'warning',
  MEDIUM: 'secondary',
  LOW: 'secondary',
} as const;

const statusBgColors = {
  pending: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  sent: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  bounced: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
} as const;

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDelete,
  onClearAll,
  isDarkMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | EmailNotification['status']>('all');
  const itemsPerPage = 10;

  const filteredNotifications = useMemo(() => {
    if (filterStatus === 'all') {
      return notifications;
    }
    return notifications.filter((n) => n.status === filterStatus);
  }, [notifications, filterStatus]);

  const sortedNotifications = useMemo(() => {
    return [...filteredNotifications].sort((a, b) => b.timestamp - a.timestamp);
  }, [filteredNotifications]);

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const paginatedNotifications = useMemo(
    () =>
      sortedNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedNotifications, currentPage]
  );

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      critical: notifications.filter((n) => n.priority === 'CRITICAL').length,
      pending: notifications.filter((n) => n.status === 'pending').length,
      failed: notifications.filter((n) => n.status === 'failed').length,
    };
  }, [notifications]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-red-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Critical
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {stats.critical}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Pending
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.pending}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Failed
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {stats.failed}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className={`rounded-lg border px-3 py-2 text-sm ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="all">All Notifications</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>

          {stats.total > 0 && (
            <Button
              onClick={onClearAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Clear All
            </Button>
          )}
        </div>
      </Card>

      {/* Notifications List */}
      <Card>
        {paginatedNotifications.length === 0 ? (
          <EmptyState
            icon="📧"
            title="No notifications"
            description={
              filterStatus === 'all'
                ? 'No notifications yet'
                : `No ${filterStatus} notifications`
            }
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <div className="space-y-2 p-4">
              {paginatedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 ${
                    isDarkMode
                      ? 'border-gray-700 bg-gray-800'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {notification.subject}
                        </h3>
                        <Badge variant={priorityColors[notification.priority]} className="text-xs">
                          {notification.priority}
                        </Badge>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            statusBgColors[notification.status]
                          }`}
                        >
                          {notification.status}
                        </span>
                      </div>

                      <p
                        className={`text-sm mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {notification.message.split('\n')[0]}
                      </p>

                      <div
                        className={`flex items-center justify-between text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <span>
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.status === 'failed' && notification.errorMessage && (
                          <span className="text-red-600 dark:text-red-400">
                            {notification.errorMessage}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => onDelete(notification.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-xs rounded"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                className={`border-t p-4 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <Pagination
                  currentPage={currentPage}
                  totalItems={sortedNotifications.length}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};
