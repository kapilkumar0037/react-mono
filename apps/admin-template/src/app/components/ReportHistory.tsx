/**
 * Report History Component
 * Display past reports and execution history
 */

import React, { useState } from 'react';
import { Button } from '@react-mono/ui-controls';
import { ReportHistoryEntry } from '../types/reporting';

interface ReportHistoryProps {
  history: ReportHistoryEntry[];
  onViewReport?: (reportId: string) => void;
  onDeleteReport?: (reportId: string) => void;
  isDarkMode?: boolean;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  history,
  onViewReport,
  onDeleteReport,
  isDarkMode = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHistory =
    filterStatus === 'all' ? history : history.filter((h) => h.status === filterStatus);

  const totalPages = Math.ceil(filteredHistory.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = filteredHistory.slice(startIdx, startIdx + pageSize);

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const statCounts = {
    total: history.length,
    completed: history.filter((h) => h.status === 'completed').length,
    failed: history.filter((h) => h.status === 'failed').length,
  };

  return (
    <div className={`${bgClass} rounded-lg shadow`}>
      {/* Summary Stats */}
      <div className={`border-b ${borderClass} p-6`}>
        <h2 className={`text-2xl font-bold ${textClass} mb-4`}>Report History</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className={`rounded p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Reports
            </p>
            <p className={`text-2xl font-bold ${textClass} mt-2`}>{statCounts.total}</p>
          </div>
          <div className={`rounded p-3 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
            <p
              className={`text-xs font-medium ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}
            >
              Successful
            </p>
            <p className={`text-2xl font-bold text-green-600 mt-2`}>{statCounts.completed}</p>
          </div>
          <div className={`rounded p-3 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <p
              className={`text-xs font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}
            >
              Failed
            </p>
            <p className={`text-2xl font-bold text-red-600 mt-2`}>{statCounts.failed}</p>
          </div>
          <div className={`rounded p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Success Rate
            </p>
            <p className={`text-2xl font-bold ${textClass} mt-2`}>
              {statCounts.total > 0
                ? Math.round((statCounts.completed / statCounts.total) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className={`border-b ${borderClass} p-6`}>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className={`rounded border px-3 py-2 text-sm ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
        >
          <option value="all">All Reports</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="p-6">
        {filteredHistory.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No reports found
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={`border-b ${borderClass} ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>
                      Report Name
                    </th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>
                      Generated
                    </th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>By</th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>Records</th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>
                      Execution Time
                    </th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>Status</th>
                    <th className={`px-4 py-3 text-left font-semibold ${textClass}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={`border-b ${borderClass} ${
                        idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className={`px-4 py-3 font-medium ${textClass}`}>
                        {entry.reportName}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(entry.generatedAt).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {entry.generatedBy}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {entry.recordCount}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {entry.executionTime}ms
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {onViewReport && (
                            <Button
                              onClick={() => onViewReport(entry.reportId)}
                              className="bg-blue-600 text-white text-xs"
                            >
                              View
                            </Button>
                          )}
                          {onDeleteReport && (
                            <Button
                              onClick={() => onDeleteReport(entry.reportId)}
                              className="bg-red-600 text-white text-xs"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Rows per page:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`rounded border px-2 py-1 text-sm ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-600 text-white disabled:bg-gray-400"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-gray-600 text-white disabled:bg-gray-400"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
