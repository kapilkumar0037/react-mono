import React, { useState, useMemo } from 'react';
import { Button } from '@react-mono/ui-controls';
import { exportToCSV } from '../utils/csvExport';
import { exportToPDF } from '../utils/pdfExport';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>[];
  selectedCount: number;
  selectedData: Record<string, any>[];
  pageTitle: string;
  columnLabels?: Record<string, string>;
  isDarkMode?: boolean;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  data,
  selectedCount,
  selectedData,
  pageTitle,
  columnLabels = {},
  isDarkMode = false,
}) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportType, setExportType] = useState<'all' | 'selected'>('all');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filename, setFilename] = useState(
    `${pageTitle.toLowerCase()}-export-${new Date().toISOString().split('T')[0]}`
  );

  const allColumns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const columnsToExport = useMemo(() => {
    if (selectedColumns.length === 0) return allColumns;
    return selectedColumns.filter(col => allColumns.includes(col));
  }, [selectedColumns, allColumns]);

  const dataToExport = exportType === 'selected' ? selectedData : data;

  const handleSelectAllColumns = () => {
    if (selectedColumns.length === allColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(allColumns);
    }
  };

  const handleToggleColumn = (column: string) => {
    setSelectedColumns(cols =>
      cols.includes(column)
        ? cols.filter(c => c !== column)
        : [...cols, column]
    );
  };

  const handleExport = () => {
    const exportFilename =
      format === 'csv'
        ? `${filename}.csv`
        : `${filename}.pdf`;

    if (format === 'csv') {
      exportToCSV(dataToExport, {
        filename: exportFilename,
        columns: columnsToExport.length > 0 ? columnsToExport : undefined,
        columnLabels,
      });
    } else {
      exportToPDF(dataToExport, {
        title: `${pageTitle} Export`,
        filename: exportFilename,
        columns: columnsToExport.length > 0 ? columnsToExport : undefined,
        columnLabels,
        includeTimestamp: true,
      });
    }

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`w-full max-w-2xl rounded-lg shadow-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Export {pageTitle}
          </h2>
        </div>

        <div className="space-y-6 p-6">
          {/* Format Selection */}
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Export Format
            </label>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'pdf')}
                  className="h-4 w-4"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  CSV (Spreadsheet)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value as 'csv' | 'pdf')}
                  className="h-4 w-4"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  PDF (Document)
                </span>
              </label>
            </div>
          </div>

          {/* Data Selection */}
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Data to Export
            </label>
            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={exportType === 'all'}
                  onChange={(e) => setExportType(e.target.value as 'all' | 'selected')}
                  className="h-4 w-4"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  All {data.length} records
                </span>
              </label>
              {selectedCount > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="selected"
                    checked={exportType === 'selected'}
                    onChange={(e) => setExportType(e.target.value as 'all' | 'selected')}
                    className="h-4 w-4"
                  />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Selected {selectedCount} record{selectedCount !== 1 ? 's' : ''}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Columns to Include
              </label>
              <button
                onClick={handleSelectAllColumns}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {selectedColumns.length === allColumns.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className={`grid grid-cols-2 gap-3 p-4 rounded-lg border ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700/50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {allColumns.map((column) => (
                <label
                  key={column}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.length === 0 || selectedColumns.includes(column)}
                    onChange={() => handleToggleColumn(column)}
                    className="h-4 w-4 rounded"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {columnLabels[column] || column}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Filename
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter filename"
              />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                .{format}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div
            className={`rounded-lg border p-3 text-sm ${
              isDarkMode
                ? 'border-blue-900/50 bg-blue-900/20 text-blue-200'
                : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}
          >
            Exporting <strong>{dataToExport.length}</strong> records with{' '}
            <strong>
              {columnsToExport.length === 0 ? allColumns.length : columnsToExport.length}
            </strong>{' '}
            columns as <strong>{format.toUpperCase()}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex justify-end gap-3 border-t px-6 py-4 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
