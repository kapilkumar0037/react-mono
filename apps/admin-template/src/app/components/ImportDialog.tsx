import React, { useState } from 'react';
import { Modal, Button } from '@react-mono/ui-controls';
import {
  ImportFormat,
  ImportStrategy,
  ImportMapping,
  ImportPreview,
} from '../types/dataImport';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (
    file: File,
    mappings: ImportMapping[],
    strategy: ImportStrategy
  ) => Promise<void>;
  columnMappings: ImportMapping[];
  supportedFormats?: ImportFormat[];
  isDarkMode?: boolean;
  title?: string;
  description?: string;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  isOpen,
  onClose,
  onImport,
  columnMappings,
  supportedFormats = [ImportFormat.CSV],
  isDarkMode = false,
  title = 'Import Data',
  description = 'Upload a CSV or JSON file to import data in bulk.',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStrategy, setSelectedStrategy] =
    useState<ImportStrategy>(ImportStrategy.SKIP_DUPLICATES);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setStep('preview');
    }
  };

  const handleStrategyChange = (strategy: ImportStrategy) => {
    setSelectedStrategy(strategy);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      await onImport(selectedFile, columnMappings, selectedStrategy);
      setStep('upload');
      setSelectedFile(null);
      setPreview(null);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Import failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className={`space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Step Indicator */}
        <div className="flex gap-2">
          {(['upload', 'preview', 'confirm'] as const).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : idx < ['upload', 'preview', 'confirm'].indexOf(step)
                      ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                      : `${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`
                }`}
              >
                {idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`h-1 w-8 ${
                    ['upload', 'preview', 'confirm'].indexOf(step) > idx
                      ? 'bg-blue-600'
                      : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <p
              className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </p>

            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div
                  className={`text-2xl mb-2`}
                >
                  📁
                </div>
                <p
                  className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Click to upload or drag and drop
                </p>
                <p
                  className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  CSV, JSON up to 10MB
                </p>
              </label>
            </div>

            {selectedFile && (
              <div
                className={`rounded-lg p-3 ${isDarkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50'}`}
              >
                <p
                  className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}
                >
                  ✓ {selectedFile.name} selected
                </p>
              </div>
            )}

            {error && (
              <div
                className={`rounded-lg p-3 ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}
              >
                <p
                  className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}
                >
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && selectedFile && preview && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h3
                className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                File Information
              </h3>
              <div
                className={`grid grid-cols-2 gap-2 text-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-3 rounded-lg`}
              >
                <div>
                  <span
                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    File Name:
                  </span>
                  <p
                    className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {preview.fileName}
                  </p>
                </div>
                <div>
                  <span
                    className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Total Rows:
                  </span>
                  <p
                    className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {preview.totalRows}
                  </p>
                </div>
              </div>
            </div>

            {preview.sampleRows.length > 0 && (
              <div>
                <h3
                  className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Preview (first 5 rows)
                </h3>
                <div className="overflow-x-auto">
                  <table
                    className={`w-full text-sm border-collapse ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <thead>
                      <tr
                        className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}
                      >
                        {preview.columns.map((col) => (
                          <th
                            key={col}
                            className={`px-3 py-2 text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.sampleRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          {preview.columns.map((col) => (
                            <td
                              key={col}
                              className={`px-3 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {preview.validationErrors.length > 0 && (
              <div
                className={`rounded-lg p-3 ${isDarkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50'}`}
              >
                <p
                  className={`font-medium text-sm mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}
                >
                  ⚠️ {preview.validationErrors.length} validation error(s) found
                </p>
                <div
                  className="space-y-1 max-h-32 overflow-y-auto"
                >
                  {preview.validationErrors.slice(0, 5).map((error, idx) => (
                    <p
                      key={idx}
                      className={`text-xs ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}
                    >
                      Row {error.rowIndex + 1}: {error.column} - {error.error}
                    </p>
                  ))}
                  {preview.validationErrors.length > 5 && (
                    <p
                      className={`text-xs ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}
                    >
                      ...and {preview.validationErrors.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div>
              <h3
                className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Import Strategy
              </h3>
              <div className="space-y-2">
                {[
                  {
                    value: ImportStrategy.SKIP_DUPLICATES,
                    label: 'Skip Duplicates',
                    desc: 'Skip rows that match existing records',
                  },
                  {
                    value: ImportStrategy.UPDATE_EXISTING,
                    label: 'Update Existing',
                    desc: 'Update matching records with new values',
                  },
                  {
                    value: ImportStrategy.REPLACE_ALL,
                    label: 'Replace All',
                    desc: 'Replace all existing records',
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                      selectedStrategy === opt.value
                        ? `${isDarkMode ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-blue-500 bg-blue-50'}`
                        : `${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                    }`}
                  >
                    <input
                      type="radio"
                      name="strategy"
                      value={opt.value}
                      checked={selectedStrategy === opt.value}
                      onChange={() => handleStrategyChange(opt.value)}
                      className="mt-1"
                    />
                    <div>
                      <p
                        className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        {opt.label}
                      </p>
                      <p
                        className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedFile && preview && (
              <div
                className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
              >
                <h4
                  className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span
                      className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Total Records:
                    </span>
                    <p
                      className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}
                    >
                      {preview.totalRows}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      File:
                    </span>
                    <p
                      className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {selectedFile.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                className={`rounded-lg p-3 ${isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'}`}
              >
                <p
                  className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}
                >
                  ⚠️ {error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Dialog Actions */}
        <div className="flex gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
          {step !== 'upload' && (
            <Button
              onClick={() => {
                if (step === 'confirm') setStep('preview');
                else setStep('upload');
              }}
              className="bg-gray-500 text-white"
              disabled={isLoading}
            >
              Back
            </Button>
          )}

          {step === 'upload' && (
            <Button onClick={onClose} className="bg-gray-500 text-white">
              Cancel
            </Button>
          )}

          {step === 'preview' && (
            <Button
              onClick={() => setStep('confirm')}
              className="bg-blue-600 text-white"
              disabled={!selectedFile || isLoading}
            >
              Next: Configure
            </Button>
          )}

          {step === 'confirm' && (
            <Button
              onClick={handleImport}
              className="bg-green-600 text-white"
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? 'Importing...' : 'Import Now'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
