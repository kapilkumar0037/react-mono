import React, { useState } from 'react';
import {
  Navbar,
  NavbarSection,
} from '@react-mono/ui-controls';
import { useLocation, useSearchParams } from 'react-router-dom';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onToggleSidebar,
  isDarkMode,
  onToggleDarkMode,
  userEmail,
  onLogout,
}) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'High inventory levels in Electronics', type: 'info', time: '5 min ago', read: false },
    { id: 2, message: 'New customer milestone: 1000 users reached!', type: 'success', time: '1 hour ago', read: false },
    { id: 3, message: 'Payment processing delay detected', type: 'warning', time: '2 hours ago', read: true },
    { id: 4, message: 'System backup completed successfully', type: 'success', time: '3 hours ago', read: true },
  ]);

  const searchQuery = searchParams.get('q') ?? '';
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }

    setSearchParams(nextParams, { replace: true });
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type: string) => {
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

  const searchPlaceholder = (() => {
    switch (location.pathname) {
      case '/customers':
        return 'Search customers, companies, or account owners...';
      case '/orders':
        return 'Search orders by ID, customer, or email...';
      case '/returns-refunds':
        return 'Search return cases, orders, or customers...';
      case '/support-tickets':
        return 'Search tickets, customers, subjects, or orders...';
      case '/users':
        return 'Search users by name or email...';
      case '/activity':
        return 'Search activity by user, action, or detail...';
      case '/notifications':
        return 'Search notifications...';
      case '/reports':
        return 'Search reports, metrics, and products...';
      case '/api-keys':
        return 'Search keys, integrations, and usage...';
      default:
        return 'Search orders, customers...';
    }
  })();



  return (
    <Navbar className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700'} h-14 flex items-center border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-600'} shadow-sm`}>
      <NavbarSection align="end" className="w-full flex items-center justify-between gap-4 relative -ml-3 pr-6">
        <button
          onClick={() => onToggleSidebar?.()}
          className="text-blue-100 hover:text-white hover:bg-blue-800 dark:hover:bg-gray-700 font-medium px-2 py-2 rounded transition-colors duration-150 hidden md:flex items-center"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-800'} text-white text-sm ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-blue-300'} rounded focus:outline-none ${isDarkMode ? 'focus:bg-gray-600' : 'focus:bg-blue-700'} transition-colors`}
            />
            <svg className={`absolute right-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-blue-300'} pointer-events-none`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="text-blue-100 hover:text-white hover:bg-blue-800 dark:hover:bg-gray-700 font-medium px-2 py-2 rounded transition-colors duration-150 relative flex items-center"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{unreadCount} new</span>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications</div>
                ) : (
                  <div className="p-2 space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg transition-colors cursor-pointer border-l-4 ${!notification.read ? 'bg-blue-50 dark:bg-gray-700 border-blue-500 dark:border-blue-500 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'} hover:shadow-md dark:hover:shadow-lg`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <span className={`text-lg ${notification.type === 'success' ? 'text-green-600 dark:text-green-400' : notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : notification.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white font-medium break-words">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                            title="Dismiss"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => onToggleDarkMode?.()}
            className="text-blue-100 hover:text-white hover:bg-blue-800 dark:hover:bg-gray-700 font-medium px-2 py-2 rounded transition-colors duration-150 flex items-center"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-blue-100 hover:text-white hover:bg-blue-800 dark:hover:bg-gray-700 font-medium px-3 py-2 rounded transition-colors duration-150 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{userEmail ?? 'Admin User'}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  onLogout?.();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg transition-colors border-t border-gray-200 dark:border-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </div>
      </NavbarSection>
    </Navbar>
  );
};

export default AdminNavbar;
