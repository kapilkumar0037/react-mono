/**
 * WorkflowExecutionDashboard Component
 * Displays workflow execution history and statistics
 */

import React, { useState } from 'react';
import { WorkflowExecution } from '../types/workflow';

interface WorkflowExecutionDashboardProps {
  executions: WorkflowExecution[];
  onViewExecution: (execution: WorkflowExecution) => void;
  isDarkMode?: boolean;
}

export const WorkflowExecutionDashboard: React.FC<WorkflowExecutionDashboardProps> = ({
  executions,
  onViewExecution,
  isDarkMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? executions : executions.filter((e) => e.status === statusFilter);
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedExecutions = filtered.slice(start, start + pageSize);

  const stats = {
    total: executions.length,
    successful: executions.filter((e) => e.status === 'success').length,
    failed: executions.filter((e) => e.status === 'failed').length,
    skipped: executions.filter((e) => e.status === 'skipped').length,
    avgDuration:
      executions.filter((e) => e.duration).length > 0
        ? Math.round(
            executions
              .filter((e) => e.duration)
              .reduce((sum, e) => sum + (e.duration || 0), 0) / executions.filter((e) => e.duration).length,
          )
        : 0,
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'skipped':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const headerClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const rowHoverClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-6 text-2xl font-bold">Execution Dashboard</h2>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">Total Executions</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">✓ Successful</div>
          <div className="mt-2 text-2xl font-bold text-green-600">{stats.successful}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">✗ Failed</div>
          <div className="mt-2 text-2xl font-bold text-red-600">{stats.failed}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">⊝ Skipped</div>
          <div className="mt-2 text-2xl font-bold text-gray-600">{stats.skipped}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">Avg Duration</div>
          <div className="mt-2 text-2xl font-bold">{stats.avgDuration}ms</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="skipped">Skipped</option>
            <option value="running">Running</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Execution Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${headerClass}`}>
              <th className="px-4 py-3 text-left text-sm font-semibold">Rule Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Entity Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trigger Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Duration (ms)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Executed At</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExecutions.length === 0 ? (
              <tr>
                <td colSpan={7} className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No executions found
                </td>
              </tr>
            ) : (
              paginatedExecutions.map((execution) => (
                <tr key={execution.id} className={`border-b transition-colors ${rowHoverClass}`}>
                  <td className="px-4 py-3 text-sm font-medium">{execution.ruleName}</td>
                  <td className="px-4 py-3 text-sm">{execution.entityType}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="capitalize">{execution.triggerType.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(execution.status)}`}>
                      {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{execution.duration || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(execution.startedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onViewExecution(execution)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm opacity-75">
            Showing {start + 1} to {Math.min(start + pageSize, total)} of {total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md px-3 py-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-3 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md px-3 py-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
