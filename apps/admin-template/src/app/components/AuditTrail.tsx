import React, { useMemo, useState } from 'react';
import { Card, Badge, Pagination } from '@react-mono/ui-controls';
import { AuditActionType, AuditSeverity, AuditFilter } from '../types/auditLog';
import { filterAuditLogs, generateAuditSummary, readAuditLogs } from '../utils/auditLogStorage';
import { EmptyState } from './EmptyState';

interface AuditTrailProps {
  isDarkMode?: boolean;
}

const severityColors = {
  [AuditSeverity.LOW]: 'secondary',
  [AuditSeverity.MEDIUM]: 'warning',
  [AuditSeverity.HIGH]: 'danger',
  [AuditSeverity.CRITICAL]: 'danger',
} as const;

const statusColors = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  failure: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
} as const;

export const AuditTrail: React.FC<AuditTrailProps> = ({ isDarkMode = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | AuditActionType>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | AuditSeverity>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failure'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const allLogs = readAuditLogs();
  const itemsPerPage = 10;

  const dateFilter = useMemo(() => {
    const now = Date.now();
    switch (dateRange) {
      case 'today':
        return { start: now - 24 * 60 * 60 * 1000 };
      case 'week':
        return { start: now - 7 * 24 * 60 * 60 * 1000 };
      case 'month':
        return { start: now - 30 * 24 * 60 * 60 * 1000 };
      default:
        return {};
    }
  }, [dateRange]);

  const filteredLogs = useMemo(() => {
    const filter: AuditFilter = {
      actionTypes: filterType !== 'all' ? [filterType] : undefined,
      severity: filterSeverity !== 'all' ? filterSeverity : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      searchQuery: searchQuery || undefined,
      startDate: dateFilter.start,
    };
    return filterAuditLogs(allLogs, filter).reverse(); // Show newest first
  }, [allLogs, filterType, filterSeverity, filterStatus, searchQuery, dateFilter]);

  const summary = useMemo(() => {
    return generateAuditSummary(allLogs);
  }, [allLogs]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(
    () => filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredLogs, currentPage]
  );

  const actionTypes = Object.values(AuditActionType);
  const severities = Object.values(AuditSeverity);

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Audit Trail
        </h1>
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Monitor all system activities, user actions, and compliance events
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-blue-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Actions
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {summary.totalActions}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-green-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Successful
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {summary.successCount}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-red-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Failed
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {summary.failureCount}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Critical
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {summary.criticalActions}
            </p>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Unique Users
            </p>
            <p className={`mt-2 text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {summary.uniqueUsers}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className={`mb-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Filters
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value as any);
                  setCurrentPage(1);
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Action Type
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as any);
                  setCurrentPage(1);
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Actions</option>
                {actionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => {
                  setFilterSeverity(e.target.value as any);
                  setCurrentPage(1);
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Levels</option>
                {severities.map((severity) => (
                  <option key={severity} value={severity}>
                    {severity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search actions..."
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card>
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No audit logs found"
            description="Try adjusting your filters or date range"
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <th className="px-6 py-3 text-left font-semibold">Timestamp</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                    <th className="px-6 py-3 text-left font-semibold">User</th>
                    <th className="px-6 py-3 text-left font-semibold">Entity</th>
                    <th className="px-6 py-3 text-left font-semibold">Severity</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {log.action}
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>{log.userName}</div>
                        <div className="text-xs">{log.userEmail}</div>
                      </td>
                      <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="font-medium">{log.entityType}</div>
                        {log.entityName && <div className="text-xs">{log.entityName}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={severityColors[log.severity]} className="text-xs">
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            statusColors[log.status]
                          }`}
                        >
                          {log.status === 'success' ? '✓' : '✗'} {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredLogs.length}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Info Footer */}
      <div className={`mt-6 rounded-lg border p-4 text-sm ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
        <p>
          <strong>Total Logs:</strong> {filteredLogs.length} of {allLogs.length} • <strong>Users:</strong>{' '}
          {summary.uniqueUsers} • <strong>Success Rate:</strong>{' '}
          {summary.totalActions > 0 ? Math.round((summary.successCount / summary.totalActions) * 100) : 0}%
        </p>
      </div>
    </div>
  );
};
