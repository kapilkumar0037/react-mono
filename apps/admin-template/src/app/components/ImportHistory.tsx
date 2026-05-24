import React, { useMemo, useState } from 'react';
import { Card, Badge, Pagination } from '@react-mono/ui-controls';
import { ImportResult, ImportStatus } from '../types/dataImport';

interface ImportHistoryProps {
  imports: ImportResult[];
  isDarkMode?: boolean;
  onViewDetails?: (result: ImportResult) => void;
}

const statusColors: Record<ImportStatus, 'success' | 'warning' | 'danger' | 'secondary'> = {
  [ImportStatus.COMPLETED]: 'success',
  [ImportStatus.PARTIALLY_COMPLETED]: 'warning',
  [ImportStatus.FAILED]: 'danger',
  [ImportStatus.PENDING]: 'secondary',
  [ImportStatus.IN_PROGRESS]: 'secondary',
};

const statusIcons = {
  [ImportStatus.COMPLETED]: '✓',
  [ImportStatus.PARTIALLY_COMPLETED]: '⚠',
  [ImportStatus.FAILED]: '✕',
  [ImportStatus.PENDING]: '...',
  [ImportStatus.IN_PROGRESS]: '...',
};

export const ImportHistory: React.FC<ImportHistoryProps> = ({
  imports,
  isDarkMode = false,
  onViewDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedImports = useMemo(
    () => [...imports].sort((a, b) => b.timestamp - a.timestamp),
    [imports]
  );

  const totalPages = Math.ceil(sortedImports.length / itemsPerPage);
  const paginatedImports = useMemo(
    () =>
      sortedImports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedImports, currentPage]
  );

  if (imports.length === 0) {
    return (
      <Card>
        <div
          className={`p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <p
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            No imports yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
            >
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                File
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Date
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Status
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Records
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Duration
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedImports.map((imp) => (
              <tr
                key={imp.id}
                className={`border-b transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <td
                  className={`px-6 py-4 text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {imp.fileName}
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(imp.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={statusColors[imp.status]} className="text-xs">
                    {statusIcons[imp.status]} {imp.status}
                  </Badge>
                </td>
                <td
                  className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <div className="flex flex-col">
                    <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
                      +{imp.successCount}
                    </span>
                    {imp.failureCount > 0 && (
                      <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                        -{imp.failureCount}
                      </span>
                    )}
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {(imp.duration / 1000).toFixed(2)}s
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails?.(imp)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedImports.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </Card>
  );
};
