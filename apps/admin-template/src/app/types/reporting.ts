/**
 * Reporting & Analytics Types
 * Feature 8: Advanced Reporting with Custom Metrics, Scheduling, and Export
 */

export enum ReportType {
  SUMMARY = 'summary',           // High-level overview with key metrics
  DETAILED = 'detailed',         // Row-by-row detailed data with all fields
  COMPARATIVE = 'comparative',   // Compare metrics across time periods
  TREND = 'trend',               // Time-series trend analysis
  DISTRIBUTION = 'distribution', // Data distribution analysis
  CUSTOM = 'custom',             // User-defined custom report
}

export enum ReportDataSource {
  USERS = 'users',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  AUDIT_LOG = 'audit_log',
  ACTIVITY = 'activity',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export enum ReportStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Filter for narrowing report data
 */
export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in';
  value: string | number | boolean | (string | number)[];
}

/**
 * Aggregation for computing metrics
 */
export interface ReportAggregation {
  name: string;
  field: string;
  type: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
  format?: 'number' | 'currency' | 'percentage' | 'duration';
}

/**
 * Report configuration
 */
export interface ReportConfig {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  dataSource: ReportDataSource;
  columns?: string[];
  filters?: ReportFilter[];
  aggregations?: ReportAggregation[];
  groupBy?: string[];
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  dateRange?: { start: Date; end: Date };
  limit?: number;
}

/**
 * Scheduled report definition
 */
export interface ScheduledReport {
  id: string;
  configId: string;
  frequency: ReportFrequency;
  nextRun: Date;
  lastRun?: Date;
  recipients: string[];
  formats: ReportFormat[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Generated report instance
 */
export interface GeneratedReport {
  id: string;
  configId: string;
  status: ReportStatus;
  type: ReportType;
  dataSource: ReportDataSource;
  title: string;
  data: Record<string, any>[];
  summary?: {
    totalRecords: number;
    recordsProcessed: number;
    generatedAt: Date;
    executionTime: number; // milliseconds
  };
  aggregationResults?: Record<string, number | string>;
  generatedBy: string;
  generatedAt: Date;
  expiresAt?: Date;
  formats?: ReportFormat[];
  errorMessage?: string;
}

/**
 * Report template for reusable reports
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  config: ReportConfig;
  icon?: string;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: Date;
  createdBy: string;
  usageCount?: number;
}

/**
 * Report history entry
 */
export interface ReportHistoryEntry {
  id: string;
  reportId: string;
  reportName: string;
  generatedAt: Date;
  generatedBy: string;
  recordCount: number;
  executionTime: number;
  status: ReportStatus;
  format?: ReportFormat;
  fileSize?: number;
}

/**
 * Report preferences
 */
export interface ReportPreferences {
  userId: string;
  defaultFormat: ReportFormat;
  defaultDateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  autoGenerateOnSave: boolean;
  emailNotifications: boolean;
  retentionDays: number;
  favoritedReports: string[];
}

/**
 * Report builder state
 */
export interface ReportBuilderState {
  currentConfig: ReportConfig;
  preview?: GeneratedReport;
  isPreviewLoading: boolean;
  validationErrors: string[];
  isDirty: boolean;
  lastSavedAt?: Date;
}

/**
 * Dashboard statistics for reporting
 */
export interface ReportingStats {
  totalReports: number;
  scheduledReports: number;
  generatedThisMonth: number;
  totalDataProcessed: number;
  averageExecutionTime: number;
  successRate: number;
}
