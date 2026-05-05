import React, { useState } from 'react';
import { Card } from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';
import { readStoredAuditEntries } from './rbacStorage';
import { useGlobalToast } from './hooks/useGlobalToast';
import { useDeleteAction } from './hooks/useActionFeedback';
import { EmptyState } from './components/EmptyState';

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
  category: 'user' | 'product' | 'order' | 'system' | 'payment';
  status: 'success' | 'pending' | 'failed';
}

interface ActivityLogProps {
  isDarkMode?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ isDarkMode = false }) => {
  const { addToast } = useGlobalToast();
  const deleteAction = useDeleteAction('Activity');
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [currentPage, setCurrentPage] = useState(1);

  // Mock activity data
  const activities: ActivityLog[] = [
    {
      id: 1,
      user: 'John Smith',
      action: 'User Created',
      description: 'New user added to the system',
      timestamp: '2 minutes ago',
      category: 'user',
      status: 'success',
    },
    {
      id: 2,
      user: 'Admin Dashboard',
      action: 'Dashboard Export',
      description: 'Sales report exported as CSV',
      timestamp: '5 minutes ago',
      category: 'system',
      status: 'success',
    },
    {
      id: 3,
      user: 'Jane Doe',
      action: 'Order Placed',
      description: 'Order #12345 created for customer',
      timestamp: '15 minutes ago',
      category: 'order',
      status: 'success',
    },
    {
      id: 4,
      user: 'System',
      action: 'Payment Processed',
      description: 'Payment of $245.00 processed successfully',
      timestamp: '22 minutes ago',
      category: 'payment',
      status: 'success',
    },
    {
      id: 5,
      user: 'Mike Wilson',
      action: 'Product Updated',
      description: 'Product "Wireless Earbuds" stock updated',
      timestamp: '1 hour ago',
      category: 'product',
      status: 'success',
    },
    {
      id: 6,
      user: 'Sarah Johnson',
      action: 'User Role Changed',
      description: 'User promoted to Manager role',
      timestamp: '2 hours ago',
      category: 'user',
      status: 'success',
    },
    {
      id: 7,
      user: 'Payment Gateway',
      action: 'Payment Failed',
      description: 'Payment retry attempted for Order #12340',
      timestamp: '3 hours ago',
      category: 'payment',
      status: 'failed',
    },
    {
      id: 8,
      user: 'System',
      action: 'Backup Created',
      description: 'Daily backup completed successfully',
      timestamp: '4 hours ago',
      category: 'system',
      status: 'success',
    },
    {
      id: 9,
      user: 'John Smith',
      action: 'Settings Updated',
      description: 'User timezone and language preferences changed',
      timestamp: '5 hours ago',
      category: 'user',
      status: 'success',
    },
    {
      id: 10,
      user: 'Admin Dashboard',
      action: 'Database Optimization',
      description: 'Database indexes optimized',
      timestamp: '6 hours ago',
      category: 'system',
      status: 'pending',
    },
    {
      id: 11,
      user: 'Emily Brown',
      action: 'Inventory Check',
      description: 'Inventory count discrepancy found and resolved',
      timestamp: '7 hours ago',
      category: 'product',
      status: 'success',
    },
    {
      id: 12,
      user: 'System',
      action: 'Login Attempt Failed',
      description: 'Multiple failed login attempts detected',
      timestamp: '8 hours ago',
      category: 'system',
      status: 'failed',
    },
  ];

  const dynamicAuditEntries = readStoredAuditEntries();
  const allActivities = [...dynamicAuditEntries, ...activities];

  // Filter and search
  const filtered = allActivities.filter((activity) => {
    const categoryMatch = filteredCategory === 'all' || activity.category === filteredCategory;
    const statusMatch = filteredStatus === 'all' || activity.status === filteredStatus;
    const searchMatch =
      searchQuery === '' ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  // Pagination
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIdx, startIdx + itemsPerPage);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'product':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'order':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'payment':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'pending':
        return '⟳';
      case 'failed':
        return '✕';
      default:
        return '•';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Activity Log
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track all user actions and system events in real-time
          </p>
        </div>

        {/* Filters */}
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                placeholder="User, action, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={filteredCategory}
                onChange={(e) => {
                  setFilteredCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Categories</option>
                <option value="user">User</option>
                <option value="product">Product</option>
                <option value="order">Order</option>
                <option value="payment">Payment</option>
                <option value="system">System</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={filteredStatus}
                onChange={(e) => {
                  setFilteredStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Stats */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Results
              </label>
              <div className={`px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filtered.length} records
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          {paginatedData.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No activities found"
              description="No activities match your filters. Try adjusting your search or date range."
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`px-2 py-2 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      User
                    </th>
                    <th className={`px-2 py-2 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Action
                    </th>
                    <th className={`px-2 py-2 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </th>
                    <th className={`px-2 py-2 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </th>
                    <th className={`px-2 py-2 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </th>
                    <th className={`px-2 py-2 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((activity) => (
                    <tr
                      key={activity.id}
                      className={`border-b text-sm ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                    >
                      <td className={`px-2 py-2 font-medium whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.user}
                      </td>
                      <td className={`px-2 py-2 font-medium whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.action}
                      </td>
                      <td className={`px-2 py-2 truncate max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.description}
                      </td>
                      <td className="px-2 py-2">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${getCategoryColor(activity.category)}`}>
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center">
                          <span className={`text-base font-bold ${getStatusColor(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                          </span>
                        </div>
                      </td>
                      <td className={`px-2 py-2 text-right text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-4 py-2 border-t text-sm ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-500 border-gray-600'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-500 border-gray-600'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ActivityLog;
