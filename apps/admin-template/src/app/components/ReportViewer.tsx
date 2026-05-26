/**
 * Report Viewer Component
 * Displays generated reports with export options
 */

import React, { useState } from 'react';
import { Button } from '@react-mono/ui-controls';
import { GeneratedReport } from '../types/reporting';

interface ReportViewerProps {
  report: GeneratedReport;
  onExportCSV?: () => void;
  onExportHTML?: () => void;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  onExportCSV,
  onExportHTML,
  onClose,
  isDarkMode = false,
}) => {
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(report.data.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = report.data.slice(startIdx, startIdx + pageSize);
  const columns = report.data.length > 0 ? Object.keys(report.data[0]) : [];

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${bgClass} rounded-lg shadow`}>
      {/* Header */}
      <div className={`border-b ${borderClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>{report.title}</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>
          {onClose && (
            <Button onClick={onClose} className="bg-gray-500 text-white">
              ✕
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Records
            </p>
            <p className={`text-2xl font-bold ${textClass} mt-1`}>
              {report.summary?.totalRecords || 0}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Processed
            </p>
            <p className={`text-2xl font-bold ${textClass} mt-1`}>
              {report.summary?.recordsProcessed || 0}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Execution Time
            </p>
            <p className={`text-2xl font-bold ${textClass} mt-1`}>
              {report.summary?.executionTime || 0}ms
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                report.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {report.status === 'completed' ? '✓ Done' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Aggregation Results */}
      {report.aggregationResults && Object.keys(report.aggregationResults).length > 0 && (
        <div className={`border-b ${borderClass} p-6`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Metrics Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(report.aggregationResults).map(([name, value]) => (
              <div
                key={name}
                className={`rounded p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
              >
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {name}
                </p>
                <p className={`text-xl font-bold ${textClass} mt-2`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className={`border-b ${borderClass} p-6 flex gap-2`}>
        {onExportCSV && (
          <Button onClick={onExportCSV} className="bg-blue-600 text-white">
            📊 Export CSV
          </Button>
        )}
        {onExportHTML && (
          <Button onClick={onExportHTML} className="bg-blue-600 text-white">
            📄 Export HTML
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="p-6">
        {report.data.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No data in report
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={`border-b ${borderClass} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    {columns.map((col) => (
                      <th
                        key={col}
                        className={`px-4 py-3 text-left font-semibold ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${borderClass} ${
                        idx % 2 === 0 ? '' : isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'
                      }`}
                    >
                      {columns.map((col) => (
                        <td key={`${idx}-${col}`} className={`px-4 py-3 ${textClass}`}>
                          {String(row[col])}
                        </td>
                      ))}
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
                    <option value={100}>100</option>
                  </select>
                </div>

                <div
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Page {currentPage} of {totalPages} ({report.data.length} total records)
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
