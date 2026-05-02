import React, { useState } from 'react';
import { Card } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  source: string;
}

interface NotificationsCenterProps {
  isDarkMode?: boolean;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ isDarkMode = false }) => {
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #12543 from John Smith has been placed and is pending fulfillment',
      type: 'success',
      read: false,
      timestamp: '5 minutes ago',
      source: 'Orders',
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Product "Wireless Earbuds" stock is running low (only 15 items left)',
      type: 'warning',
      read: false,
      timestamp: '1 hour ago',
      source: 'Inventory',
    },
    {
      id: 3,
      title: 'Payment Processing',
      message: 'Payment of $1,250.00 is being processed for Order #12540',
      type: 'info',
      read: false,
      timestamp: '2 hours ago',
      source: 'Payments',
    },
    {
      id: 4,
      title: 'User Registration',
      message: 'New user "Emily Davis" has registered and is awaiting email verification',
      type: 'info',
      read: true,
      timestamp: '3 hours ago',
      source: 'Users',
    },
    {
      id: 5,
      title: 'System Backup Failed',
      message: 'Daily backup scheduled for 2:00 AM failed. Please check system logs.',
      type: 'error',
      read: true,
      timestamp: '4 hours ago',
      source: 'System',
    },
    {
      id: 6,
      title: 'Report Generated',
      message: 'Your monthly sales report is ready for download',
      type: 'success',
      read: true,
      timestamp: '5 hours ago',
      source: 'Reports',
    },
    {
      id: 7,
      title: 'Return Request',
      message: 'Customer initiated return for Order #12535 - Smart Watch',
      type: 'warning',
      read: true,
      timestamp: '6 hours ago',
      source: 'Orders',
    },
    {
      id: 8,
      title: 'Security Alert',
      message: 'Multiple login attempts detected from different locations',
      type: 'error',
      read: true,
      timestamp: '7 hours ago',
      source: 'Security',
    },
    {
      id: 9,
      title: 'Promotion Started',
      message: '"Spring Sale" promotion has started and is now active',
      type: 'success',
      read: true,
      timestamp: '1 day ago',
      source: 'Marketing',
    },
    {
      id: 10,
      title: 'Database Maintenance',
      message: 'Scheduled database maintenance will occur on March 1st at 2:00 AM',
      type: 'info',
      read: true,
      timestamp: '2 days ago',
      source: 'System',
    },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  const filtered = notifications.filter((notif) => {
    const typeMatch = filterType === 'all' || notif.type === filterType;
    const readMatch = filterRead === 'all' || (filterRead === 'unread' ? !notif.read : notif.read);
    const searchMatch =
      searchQuery === '' ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.source.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && readMatch && searchMatch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return isDarkMode ? 'bg-green-900 border-l-4 border-green-500' : 'bg-green-50 border-l-4 border-green-500';
      case 'warning':
        return isDarkMode ? 'bg-yellow-900 border-l-4 border-yellow-500' : 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'error':
        return isDarkMode ? 'bg-red-900 border-l-4 border-red-500' : 'bg-red-50 border-l-4 border-red-500';
      default:
        return isDarkMode ? 'bg-blue-900 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500';
    }
  };

  const getTypeTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Orders': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Inventory': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Payments': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Users': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'System': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'Reports': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Marketing': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[source] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, message, or source..."
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Read Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            {/* Delete All */}
            <div className="flex items-end">
              <button
                onClick={deleteAll}
                disabled={notifications.length === 0}
                className={`w-full px-4 py-2 rounded border transition-colors ${
                  notifications.length === 0
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 border-gray-600'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                    : isDarkMode
                    ? 'bg-red-900 text-red-200 border-red-700 hover:bg-red-800'
                    : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                }`}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  getTypeColor(notif.type)
                } ${!notif.read ? 'shadow-md' : 'opacity-75 hover:opacity-100'}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 text-xl font-bold ${getTypeTextColor(notif.type)}`}>
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? (notif.type === 'success' ? 'text-green-200' : notif.type === 'warning' ? 'text-yellow-200' : notif.type === 'error' ? 'text-red-200' : 'text-blue-200') : (notif.type === 'success' ? 'text-green-900' : notif.type === 'warning' ? 'text-yellow-900' : notif.type === 'error' ? 'text-red-900' : 'text-blue-900')}`}>
                          {notif.title}
                        </h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? (notif.type === 'success' ? 'text-green-100' : notif.type === 'warning' ? 'text-yellow-100' : notif.type === 'error' ? 'text-red-100' : 'text-blue-100') : (notif.type === 'success' ? 'text-green-800' : notif.type === 'warning' ? 'text-yellow-800' : notif.type === 'error' ? 'text-red-800' : 'text-blue-800')}`}>
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getSourceBadgeColor(notif.source)}`}>
                          {notif.source}
                        </span>
                        <span className={`text-xs ${isDarkMode ? (notif.type === 'success' ? 'text-green-200' : notif.type === 'warning' ? 'text-yellow-200' : notif.type === 'error' ? 'text-red-200' : 'text-blue-200') : (notif.type === 'success' ? 'text-green-700' : notif.type === 'warning' ? 'text-yellow-700' : notif.type === 'error' ? 'text-red-700' : 'text-blue-700')}`}>
                          {notif.timestamp}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className={`text-xs hover:underline ${isDarkMode ? (notif.type === 'success' ? 'text-green-200 hover:text-green-100' : notif.type === 'warning' ? 'text-yellow-200 hover:text-yellow-100' : notif.type === 'error' ? 'text-red-200 hover:text-red-100' : 'text-blue-200 hover:text-blue-100') : (notif.type === 'success' ? 'text-green-700 hover:text-green-600' : notif.type === 'warning' ? 'text-yellow-700 hover:text-yellow-600' : notif.type === 'error' ? 'text-red-700 hover:text-red-600' : 'text-blue-700 hover:text-blue-600')}`}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <div className="text-center py-12">
              <div className={`text-4xl mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                🔔
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No notifications
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationsCenter;
