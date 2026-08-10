import React, { useState } from 'react';
import { Card, Badge } from '@react-mono/ui-controls';
import { ImportResult, ImportStatus } from '../types/dataImport';

interface ImportDetailsModalProps {
  result: ImportResult | null;
  isDarkMode?: boolean;
  onClose: () => void;
}

const statusColors: Record<ImportStatus, 'success' | 'warning' | 'danger' | 'secondary'> = {
  [ImportStatus.COMPLETED]: 'success',
  [ImportStatus.PARTIALLY_COMPLETED]: 'warning',
  [ImportStatus.FAILED]: 'danger',
  [ImportStatus.PENDING]: 'secondary',
  [ImportStatus.IN_PROGRESS]: 'secondary',
};

export const ImportDetailsModal: React.FC<ImportDetailsModalProps> = ({
  result,
  isDarkMode = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'errors' | 'created' | 'skipped'>(
    'summary'
  );

  if (!result) return null;

  const successRate =
    result.totalRows > 0
      ? Math.round(((result.successCount + result.updatedRecords.length) / result.totalRows) * 100)
      : 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-50'}`}
      onClick={onClose}
    >
      <Card
        className={`w-full max-w-2xl max-h-96 overflow-y-auto ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`border-b px-6 py-4 flex items-center justify-between ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Import Details
            </h2>
            <p
              className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {result.fileName}
            </p>
          </div>
          <Badge variant={statusColors[result.status]} className="text-sm">
            {result.status}
          </Badge>
          <button
            onClick={onClose}
            className={`text-lg font-bold ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            ✕
          </button>
        </div>

        {/* Summary Cards */}
        <div className={`grid grid-cols-4 gap-3 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div
            className={`rounded-lg p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
          >
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {result.totalRows}
            </p>
          </div>

          <div
            className={`rounded-lg p-3 ${isDarkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'}`}
          >
            <p
              className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
            >
              Success
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
            >
              {result.successCount}
            </p>
          </div>

          <div
            className={`rounded-lg p-3 ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}
          >
            <p
              className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              Failed
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              {result.failureCount}
            </p>
          </div>

          <div
            className={`rounded-lg p-3 ${isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}
          >
            <p
              className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              Duration
            </p>
            <p
              className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {(result.duration / 1000).toFixed(2)}s
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          {(['summary', 'errors', 'created', 'skipped'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? `border-blue-600 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                  : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              {tab === 'summary'
                ? 'Summary'
                : tab === 'errors'
                  ? `Errors (${result.errors.length})`
                  : tab === 'created'
                    ? `Created (${result.createdRecords.length})`
                    : `Skipped (${result.skippedRecords.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <p
                  className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Import Information
                </p>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      File:
                    </span>
                    <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                      {result.fileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Started by:
                    </span>
                    <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                      {result.startedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Date:
                    </span>
                    <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Success Rate:
                    </span>
                    <span
                      className={`font-bold ${
                        successRate >= 80
                          ? isDarkMode
                            ? 'text-green-400'
                            : 'text-green-600'
                          : isDarkMode
                            ? 'text-yellow-400'
                            : 'text-yellow-600'
                      }`}
                    >
                      {successRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-2">
              {result.errors.length === 0 ? (
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  No errors
                </p>
              ) : (
                result.errors.map((error, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-sm ${isDarkMode ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-50 text-red-700'}`}
                  >
                    <p className="font-medium">
                      Row {error.rowIndex + 1}: {error.column}
                    </p>
                    <p className="text-xs mt-1">{error.error}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'created' && (
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {result.createdRecords.length === 0 ? (
                <p
                  className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  No records created
                </p>
              ) : (
                result.createdRecords.slice(0, 10).map((record, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${isDarkMode ? 'bg-green-900 bg-opacity-20 border border-green-700' : 'bg-green-50 border border-green-200'}`}
                  >
                    <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>
                      {JSON.stringify(record).substring(0, 60)}...
                    </p>
                  </div>
                ))
              )}
              {result.createdRecords.length > 10 && (
                <p
                  className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  ... and {result.createdRecords.length - 10} more
                </p>
              )}
            </div>
          )}

          {activeTab === 'skipped' && (
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {result.skippedRecords.length === 0 ? (
                <p
                  className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  No records skipped
                </p>
              ) : (
                result.skippedRecords.slice(0, 10).map((record, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-xs ${isDarkMode ? 'bg-yellow-900 bg-opacity-20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}
                  >
                    <p className={isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}>
                      {JSON.stringify(record).substring(0, 80)}...
                    </p>
                  </div>
                ))
              )}
              {result.skippedRecords.length > 10 && (
                <p
                  className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  ... and {result.skippedRecords.length - 10} more
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
