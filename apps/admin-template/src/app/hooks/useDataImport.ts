import { useCallback, useState } from 'react';
import {
  ImportFormat,
  ImportStrategy,
  ImportStatus,
  ImportResult,
  ImportPreview,
  ImportConfig,
  ImportMapping,
} from '../types/dataImport';
import {
  parseCSV,
  validateImportData,
  transformRowData,
  saveImportResult,
  readImportHistory,
  getImportResult,
} from '../utils/dataImportStorage';

export const useDataImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);

  /**
   * Generate preview from file
   */
  const generatePreview = useCallback(
    async (
      file: File,
      format: ImportFormat,
      mappings: ImportMapping[],
      skipHeader: boolean = true
    ): Promise<ImportPreview | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const content = await file.text();

        if (format === ImportFormat.CSV) {
          const { columns, rows } = parseCSV(content, skipHeader);
          const sampleRows = rows.slice(0, 5);
          const validationErrors = validateImportData(rows, mappings);

          const estimatedRecords = {
            toCreate: rows.length,
            toUpdate: 0,
            toSkip: 0,
          };

          const preview: ImportPreview = {
            fileName: file.name,
            format,
            totalRows: rows.length,
            columns,
            sampleRows,
            validationErrors,
            estimatedRecords,
          };

          setPreview(preview);
          return preview;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to process file';
        setError(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Execute import
   */
  const executeImport = useCallback(
    async (
      file: File,
      format: ImportFormat,
      config: ImportConfig,
      onProgressUpdate?: (progress: {
        processed: number;
        total: number;
        current: 'creating' | 'updating' | 'validating';
      }) => void,
      onCreateRecord?: (record: any) => void,
      onUpdateRecord?: (existing: any, updated: any) => void,
      onSkipRecord?: (record: any, reason: string) => void
    ): Promise<ImportResult> => {
      setIsLoading(true);
      setError(null);

      const startTime = Date.now();
      const resultId = `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      try {
        const content = await file.text();
        const { rows } = parseCSV(content, config.skipHeader);

        // Validate data
        onProgressUpdate?.({
          processed: 0,
          total: rows.length,
          current: 'validating',
        });

        const validationErrors = validateImportData(rows, config.columnMappings, config);

        if (config.stopOnFirstError && validationErrors.length > 0) {
          throw new Error(
            `Validation failed at row ${validationErrors[0].rowIndex + 1}: ${validationErrors[0].error}`
          );
        }

        // Transform and process rows
        const createdRecords: any[] = [];
        const updatedRecords: any[] = [];
        const skippedRecords: any[] = [];
        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          try {
            // Check for validation errors in this row
            const rowErrors = validationErrors.filter((e) => e.rowIndex === i);
            if (rowErrors.length > 0) {
              failureCount++;
              skippedRecords.push({ row, errors: rowErrors });
              onSkipRecord?.(row, `${rowErrors.length} validation error(s)`);
              onProgressUpdate?.({
                processed: i + 1,
                total: rows.length,
                current: 'creating',
              });
              continue;
            }

            const transformed = transformRowData(row, config.columnMappings);

            // Handle strategy
            if (config.strategy === ImportStrategy.SKIP_DUPLICATES) {
              // Mark for creation
              createdRecords.push(transformed);
              onCreateRecord?.(transformed);
              successCount++;
            } else if (config.strategy === ImportStrategy.UPDATE_EXISTING) {
              // Try to find existing by deduplication keys
              if (
                config.deduplicateBy &&
                config.deduplicateBy.length > 0
              ) {
                // This would check against actual data
                createdRecords.push(transformed);
                onCreateRecord?.(transformed);
                successCount++;
              } else {
                createdRecords.push(transformed);
                onCreateRecord?.(transformed);
                successCount++;
              }
            } else if (config.strategy === ImportStrategy.REPLACE_ALL) {
              createdRecords.push(transformed);
              onCreateRecord?.(transformed);
              successCount++;
            }
          } catch (rowErr) {
            failureCount++;
            const reason =
              rowErr instanceof Error ? rowErr.message : 'Unknown error';
            skippedRecords.push({ row, error: reason });
            onSkipRecord?.(row, reason);
          }

          onProgressUpdate?.({
            processed: i + 1,
            total: rows.length,
            current: 'creating',
          });
        }

        const result: ImportResult = {
          id: resultId,
          timestamp: Date.now(),
          fileName: file.name,
          format,
          strategy: config.strategy,
          totalRows: rows.length,
          successCount,
          failureCount,
          status:
            failureCount === 0
              ? ImportStatus.COMPLETED
              : failureCount === rows.length
                ? ImportStatus.FAILED
                : ImportStatus.PARTIALLY_COMPLETED,
          errors: validationErrors,
          warnings: [],
          createdRecords,
          updatedRecords,
          skippedRecords,
          duration: Date.now() - startTime,
          startedBy: 'user',
        };

        saveImportResult(result);
        setLastResult(result);

        return result;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Import failed';
        setError(errorMsg);

        const result: ImportResult = {
          id: resultId,
          timestamp: Date.now(),
          fileName: file.name,
          format,
          strategy: config.strategy,
          totalRows: 0,
          successCount: 0,
          failureCount: 0,
          status: ImportStatus.FAILED,
          errors: [],
          warnings: [errorMsg],
          createdRecords: [],
          updatedRecords: [],
          skippedRecords: [],
          duration: Date.now() - startTime,
          startedBy: 'user',
        };

        saveImportResult(result);
        setLastResult(result);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getHistory = useCallback(() => {
    return readImportHistory();
  }, []);

  const getResult = useCallback((resultId: string) => {
    return getImportResult(resultId);
  }, []);

  return {
    isLoading,
    error,
    preview,
    lastResult,
    generatePreview,
    executeImport,
    getHistory,
    getResult,
  };
};
