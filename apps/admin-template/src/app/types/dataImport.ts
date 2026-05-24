export enum ImportFormat {
  CSV = 'CSV',
  JSON = 'JSON',
}

export enum ImportStrategy {
  SKIP_DUPLICATES = 'SKIP_DUPLICATES',
  UPDATE_EXISTING = 'UPDATE_EXISTING',
  REPLACE_ALL = 'REPLACE_ALL',
}

export enum ImportStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
}

export interface ImportValidationError {
  rowIndex: number;
  column: string;
  value: any;
  error: string;
}

export interface ImportResult {
  id: string;
  timestamp: number;
  fileName: string;
  format: ImportFormat;
  strategy: ImportStrategy;
  totalRows: number;
  successCount: number;
  failureCount: number;
  status: ImportStatus;
  errors: ImportValidationError[];
  warnings: string[];
  createdRecords: any[];
  updatedRecords: any[];
  skippedRecords: any[];
  duration: number; // milliseconds
  startedBy: string;
}

export interface ImportPreview {
  fileName: string;
  format: ImportFormat;
  totalRows: number;
  columns: string[];
  sampleRows: Record<string, any>[];
  validationErrors: ImportValidationError[];
  estimatedRecords: {
    toCreate: number;
    toUpdate: number;
    toSkip: number;
  };
}

export interface ImportHistory {
  imports: ImportResult[];
  lastImportDate: number;
  totalRecordsImported: number;
  totalRecordsFailed: number;
}

export interface ImportMapping {
  csvColumn: string;
  entityField: string;
  required: boolean;
  dataType: 'string' | 'number' | 'email' | 'boolean' | 'date';
  transformer?: (value: any) => any;
}

export interface ImportConfig {
  format: ImportFormat;
  strategy: ImportStrategy;
  columnMappings: ImportMapping[];
  skipHeader: boolean;
  deduplicateBy?: string[];
  validateEmail?: boolean;
  validatePhoneNumber?: boolean;
  stopOnFirstError?: boolean;
}
