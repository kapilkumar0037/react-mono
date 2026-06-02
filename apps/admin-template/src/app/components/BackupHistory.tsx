/**
 * BackupHistory Component
 * Displays backup execution history and metadata
 */

import React, { useState } from 'react';
import { BackupMetadata } from '../types/backup';

interface BackupHistoryProps {
  backups: BackupMetadata[];
  onVerifyBackup: (backupId: string) => void;
  onRestoreBackup: (backup: BackupMetadata) => void;
  isDarkMode?: boolean;
}

export const BackupHistory: React.FC<BackupHistoryProps> = ({
  backups,
  onVerifyBackup,
  onRestoreBackup,
  isDarkMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? backups : backups.filter((b) => b.status === statusFilter);
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedBackups = filtered.slice(start, start + pageSize);

  const stats = {
    total: backups.length,
    completed: backups.filter((b) => b.status === 'completed').length,
    running: backups.filter((b) => b.status === 'running').length,
    failed: backups.filter((b) => b.status === 'failed').length,
    totalSize: backups.reduce((sum, b) => sum + b.sizeBytes, 0),
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const headerClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const rowHoverClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-6 text-2xl font-bold">Backup History</h2>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">Total Backups</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">✓ Completed</div>
          <div className="mt-2 text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">⏱ Running</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{stats.running}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">✗ Failed</div>
          <div className="mt-2 text-2xl font-bold text-red-600">{stats.failed}</div>
        </div>
        <div className={`rounded-lg border p-4 ${cardClass}`}>
          <div className="text-sm font-medium opacity-75">Total Size</div>
          <div className="mt-2 text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
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
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="scheduled">Scheduled</option>
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

      {/* Backup Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${headerClass}`}>
              <th className="px-4 py-3 text-left text-sm font-semibold">Backup ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Size</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Records</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Completed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBackups.length === 0 ? (
              <tr>
                <td colSpan={8} className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No backups found
                </td>
              </tr>
            ) : (
              paginatedBackups.map((backup) => (
                <tr key={backup.backupId} className={`border-b transition-colors ${rowHoverClass}`}>
                  <td className="px-4 py-3 text-sm font-mono text-xs">{backup.backupId.substring(0, 12)}...</td>
                  <td className="px-4 py-3 text-sm capitalize">
                    <span className="font-medium">{backup.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(backup.status)}`}>
                      {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatBytes(backup.sizeBytes)}</td>
                  <td className="px-4 py-3 text-sm">{backup.recordCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{backup.duration ? `${Math.round(backup.duration / 1000)}s` : '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {backup.completedAt
                      ? new Date(backup.completedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button
                      onClick={() => onVerifyBackup(backup.backupId)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => onRestoreBackup(backup)}
                      disabled={backup.status !== 'completed'}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium text-xs disabled:opacity-50"
                    >
                      Restore
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
