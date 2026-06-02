/**
 * Backup & Disaster Recovery Types
 * Feature 10: Comprehensive backup management and restore capabilities
 */

export enum BackupType {
  FULL = 'full',           // Complete backup of all data
  INCREMENTAL = 'incremental', // Only changes since last backup
  DIFFERENTIAL = 'differential', // Changes since last full backup
  SNAPSHOT = 'snapshot',   // Point-in-time snapshot
}

export enum BackupStatus {
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CORRUPTED = 'corrupted',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
}

export enum BackupFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ON_DEMAND = 'on_demand',
}

export enum BackupDestination {
  LOCAL = 'local',
  CLOUD_S3 = 'cloud_s3',
  CLOUD_AZURE = 'cloud_azure',
  SFTP = 'sftp',
  NAS = 'nas',
}

export enum RetentionPolicy {
  SEVEN_DAYS = '7days',
  THIRTY_DAYS = '30days',
  NINETY_DAYS = '90days',
  ONE_YEAR = '1year',
  INDEFINITE = 'indefinite',
}

/**
 * Backup metadata and content
 */
export interface BackupMetadata {
  backupId: string;
  timestamp: Date;
  type: BackupType;
  status: BackupStatus;
  sizeBytes: number;
  recordCount: number;
  entityTypes: string[]; // e.g., 'users', 'orders', 'customers'
  checksum: string;
  completedAt?: Date;
  duration?: number; // milliseconds
  errorMessage?: string;
}

/**
 * Backup task configuration
 */
export interface BackupTask {
  id: string;
  name: string;
  description?: string;
  schedule: {
    frequency: BackupFrequency;
    time: string; // HH:mm format
    daysOfWeek?: number[]; // 0-6 for weekly backups
    dayOfMonth?: number; // For monthly backups
  };
  backupType: BackupType;
  destination: BackupDestination;
  destinationPath?: string; // Cloud bucket, NAS path, etc.
  includeEntityTypes: string[];
  excludeEntityTypes?: string[];
  retentionPolicy: RetentionPolicy;
  isActive: boolean;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  encryptionKey?: string;
  notifyOnCompletion: boolean;
  notifyOnFailure: boolean;
  notificationEmails: string[];
  lastBackupId?: string;
  lastBackupTime?: Date;
  nextScheduledTime?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

/**
 * Backup file/object entry
 */
export interface BackupFile {
  id: string;
  backupId: string;
  filename: string;
  path: string;
  sizeBytes: number;
  contentType: string;
  checksum: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Recovery point definition
 */
export interface RecoveryPoint {
  backupId: string;
  timestamp: Date;
  type: BackupType;
  status: BackupStatus;
  recoveryTimeObjective: number; // minutes to restore
  recoveryPointObjective: number; // minutes of data loss
  sizeBytes: number;
  canRestore: boolean;
  verificationStatus: 'verified' | 'unverified' | 'failed';
}

/**
 * Restore operation
 */
export interface RestoreOperation {
  id: string;
  backupId: string;
  backupTimestamp: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  targetEnvironment: 'dev' | 'staging' | 'production';
  selectedEntityTypes: string[];
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
  recordsRestored?: number;
  errorMessage?: string;
  verificationStatus?: 'passed' | 'failed' | 'pending';
  rollbackPoint?: BackupMetadata;
}

/**
 * Backup statistics
 */
export interface BackupStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalStorageBytes: number;
  oldestBackup?: Date;
  newestBackup?: Date;
  averageBackupTime: number; // milliseconds
  successRate: number; // percentage
  lastBackupStatus: BackupStatus;
  totalRestores: number;
  successfulRestores: number;
}

/**
 * Backup verification result
 */
export interface BackupVerification {
  backupId: string;
  verifiedAt: Date;
  isValid: boolean;
  checksumMatch: boolean;
  recoverable: boolean;
  issues: string[];
  warnings?: string[];
}

/**
 * Retention and cleanup record
 */
export interface RetentionRecord {
  backupId: string;
  createdAt: Date;
  expiresAt: Date;
  retentionPolicy: RetentionPolicy;
  isExpired: boolean;
  deletedAt?: Date;
}

/**
 * Disaster recovery plan
 */
export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description?: string;
  rtoMinutes: number; // Recovery Time Objective
  rpoMinutes: number; // Recovery Point Objective
  backupTasks: string[]; // IDs of backup tasks
  testFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastTestedAt?: Date;
  nextTestAt?: Date;
  status: 'active' | 'inactive' | 'testing';
  contactEmails: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Backup preferences
 */
export interface BackupPreferences {
  userId: string;
  autoStartBackups: boolean;
  notifyOnBackupStart: boolean;
  notifyOnBackupCompletion: boolean;
  notifyOnBackupFailure: boolean;
  parallelBackupTasks: number; // Max concurrent backups
  maxBackupDuration: number; // seconds
  verifyBackupsAfterCreation: boolean;
  bandwidthLimitMbps?: number;
}
