import {
  ImportValidationError,
  ImportResult,
  ImportHistory,
  ImportConfig,
} from '../types/dataImport';

const IMPORT_HISTORY_KEY = 'import:history';
const IMPORT_RESULTS_PREFIX = 'import:result:';

/**
 * Parse CSV content
 */
export const parseCSV = (
  content: string,
  skipHeader: boolean = true
): { columns: string[]; rows: Record<string, any>[] } => {
  const lines = content.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const columns = lines[0].split(',').map((col) => col.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, any>[] = [];

  const startIndex = skipHeader ? 1 : 0;
  for (let i = startIndex; i < lines.length; i++) {
    const values = lines[i]
      .split(',')
      .map((val) => val.trim().replace(/^"|"$/g, ''));
    const row: Record<string, any> = {};

    columns.forEach((col, index) => {
      row[col] = values[index] || '';
    });

    rows.push(row);
  }

  return { columns, rows };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate imported data
 */
export const validateImportData = (
  rows: Record<string, any>[],
  mappings: ImportConfig['columnMappings'],
  config: Partial<ImportConfig> = {}
): ImportValidationError[] => {
  const errors: ImportValidationError[] = [];

  rows.forEach((row, rowIndex) => {
    mappings.forEach((mapping) => {
      const value = row[mapping.csvColumn];

      // Check required fields
      if (mapping.required && (!value || value === '')) {
        errors.push({
          rowIndex,
          column: mapping.csvColumn,
          value,
          error: `${mapping.csvColumn} is required`,
        });
        return;
      }

      // Validate by data type
      switch (mapping.dataType) {
        case 'email':
          if (value && config.validateEmail && !isValidEmail(value)) {
            errors.push({
              rowIndex,
              column: mapping.csvColumn,
              value,
              error: `Invalid email format: ${value}`,
            });
          }
          break;

        case 'number':
          if (value && isNaN(Number(value))) {
            errors.push({
              rowIndex,
              column: mapping.csvColumn,
              value,
              error: `Expected number but got: ${value}`,
            });
          }
          break;

        case 'date':
          if (value && isNaN(Date.parse(value))) {
            errors.push({
              rowIndex,
              column: mapping.csvColumn,
              value,
              error: `Invalid date format: ${value}`,
            });
          }
          break;

        case 'boolean':
          if (
            value &&
            !['true', 'false', '1', '0', 'yes', 'no'].includes(
              String(value).toLowerCase()
            )
          ) {
            errors.push({
              rowIndex,
              column: mapping.csvColumn,
              value,
              error: `Expected boolean value but got: ${value}`,
            });
          }
          break;
      }
    });
  });

  return errors;
};

/**
 * Transform imported row data
 */
export const transformRowData = (
  row: Record<string, any>,
  mappings: ImportConfig['columnMappings']
): Record<string, any> => {
  const transformed: Record<string, any> = {};

  mappings.forEach((mapping) => {
    let value = row[mapping.csvColumn];

    // Apply transformer if defined
    if (mapping.transformer) {
      value = mapping.transformer(value);
    }

    // Apply default transformations by type
    switch (mapping.dataType) {
      case 'number':
        transformed[mapping.entityField] =
          value === '' ? null : Number(value);
        break;

      case 'boolean':
        if (value !== '') {
          transformed[mapping.entityField] = [
            'true',
            '1',
            'yes',
          ].includes(String(value).toLowerCase());
        }
        break;

      case 'date':
        transformed[mapping.entityField] =
          value === '' ? null : new Date(value).toISOString().split('T')[0];
        break;

      default:
        transformed[mapping.entityField] = value || null;
    }
  });

  return transformed;
};

/**
 * Save import result to storage
 */
export const saveImportResult = (result: ImportResult): void => {
  const key = `${IMPORT_RESULTS_PREFIX}${result.id}`;
  localStorage.setItem(key, JSON.stringify(result));

  // Update history
  const history = readImportHistory();
  history.imports.push({
    id: result.id,
    timestamp: result.timestamp,
    fileName: result.fileName,
    format: result.format,
    strategy: result.strategy,
    totalRows: result.totalRows,
    successCount: result.successCount,
    failureCount: result.failureCount,
    status: result.status,
    errors: result.errors,
    warnings: result.warnings,
    createdRecords: result.createdRecords,
    updatedRecords: result.updatedRecords,
    skippedRecords: result.skippedRecords,
    duration: result.duration,
    startedBy: result.startedBy,
  });

  // Keep last 100 imports
  if (history.imports.length > 100) {
    history.imports = history.imports.slice(-100);
  }

  history.lastImportDate = result.timestamp;
  history.totalRecordsImported += result.successCount + result.updatedRecords.length;
  history.totalRecordsFailed += result.failureCount;

  localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(history));
};

/**
 * Read import history
 */
export const readImportHistory = (): ImportHistory => {
  const stored = localStorage.getItem(IMPORT_HISTORY_KEY);
  if (!stored) {
    return {
      imports: [],
      lastImportDate: 0,
      totalRecordsImported: 0,
      totalRecordsFailed: 0,
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      imports: [],
      lastImportDate: 0,
      totalRecordsImported: 0,
      totalRecordsFailed: 0,
    };
  }
};

/**
 * Get specific import result
 */
export const getImportResult = (resultId: string): ImportResult | null => {
  const key = `${IMPORT_RESULTS_PREFIX}${resultId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Clear old import records
 */
export const clearOldImportRecords = (daysOld: number = 30): number => {
  const history = readImportHistory();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const initialCount = history.imports.length;

  history.imports = history.imports.filter((imp) => imp.timestamp > cutoffTime);

  // Delete individual result records
  const allKeys = Object.keys(localStorage);
  let deletedCount = 0;
  allKeys.forEach((key) => {
    if (key.startsWith(IMPORT_RESULTS_PREFIX)) {
      const resultId = key.replace(IMPORT_RESULTS_PREFIX, '');
      if (!history.imports.find((imp) => imp.id === resultId)) {
        localStorage.removeItem(key);
        deletedCount++;
      }
    }
  });

  if (history.imports.length !== initialCount) {
    localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(history));
  }

  return deletedCount;
};
