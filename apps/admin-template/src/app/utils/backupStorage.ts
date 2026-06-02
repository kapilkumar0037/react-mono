/**
 * Backup Storage Utilities
 * Handles persistence of backup tasks, metadata, and recovery operations
 */

import {
  BackupTask,
  BackupMetadata,
  RestoreOperation,
  RecoveryPoint,
  BackupStats,
  BackupVerification,
  BackupPreferences,
  RetentionRecord,
  DisasterRecoveryPlan,
  BackupStatus,
} from '../types/backup';

const BACKUP_TASKS_KEY = 'backup:tasks';
const BACKUP_METADATA_KEY = 'backup:metadata';
const RESTORE_OPERATIONS_KEY = 'backup:restores';
const BACKUP_VERIFICATIONS_KEY = 'backup:verifications';
const RETENTION_RECORDS_KEY = 'backup:retention';
const DISASTER_PLANS_KEY = 'backup:plans';
const PREFERENCES_KEY = 'backup:preferences';

// Backup Tasks
export const readBackupTasks = (): BackupTask[] => {
  try {
    const data = localStorage.getItem(BACKUP_TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistBackupTasks = (tasks: BackupTask[]): void => {
  try {
    const limitedTasks = tasks.slice(-50);
    localStorage.setItem(BACKUP_TASKS_KEY, JSON.stringify(limitedTasks));
  } catch (error) {
    console.error('Error persisting backup tasks:', error);
  }
};

export const saveBackupTask = (task: BackupTask): void => {
  const tasks = readBackupTasks();
  const existing = tasks.findIndex((t) => t.id === task.id);
  if (existing >= 0) {
    tasks[existing] = task;
  } else {
    tasks.push(task);
  }
  persistBackupTasks(tasks);
};

export const getBackupTask = (id: string): BackupTask | undefined => {
  return readBackupTasks().find((t) => t.id === id);
};

export const deleteBackupTask = (id: string): void => {
  const tasks = readBackupTasks().filter((t) => t.id !== id);
  persistBackupTasks(tasks);
};

export const getActiveBackupTasks = (): BackupTask[] => {
  return readBackupTasks().filter((t) => t.isActive);
};

// Backup Metadata
export const readBackupMetadata = (): BackupMetadata[] => {
  try {
    const data = localStorage.getItem(BACKUP_METADATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistBackupMetadata = (metadata: BackupMetadata[]): void => {
  try {
    const limitedMetadata = metadata.slice(-200);
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(limitedMetadata));
  } catch (error) {
    console.error('Error persisting backup metadata:', error);
  }
};

export const recordBackupMetadata = (metadata: BackupMetadata): void => {
  const allMetadata = readBackupMetadata();
  allMetadata.push(metadata);
  persistBackupMetadata(allMetadata);
};

export const getBackupMetadata = (backupId: string): BackupMetadata | undefined => {
  return readBackupMetadata().find((m) => m.backupId === backupId);
};

export const getBackupsByStatus = (status: BackupStatus): BackupMetadata[] => {
  return readBackupMetadata().filter((m) => m.status === status);
};

export const getBackupsByTaskId = (taskId: string): BackupMetadata[] => {
  const task = getBackupTask(taskId);
  if (!task) return [];
  return readBackupMetadata().filter((m) => m.backupId.includes(taskId));
};

export const clearOldBackups = (daysOld: number = 90): void => {
  const metadata = readBackupMetadata();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = metadata.filter((m) => new Date(m.timestamp).getTime() > cutoffTime);
  persistBackupMetadata(filtered);
};

// Restore Operations
export const readRestoreOperations = (): RestoreOperation[] => {
  try {
    const data = localStorage.getItem(RESTORE_OPERATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistRestoreOperations = (operations: RestoreOperation[]): void => {
  try {
    const limitedOps = operations.slice(-100);
    localStorage.setItem(RESTORE_OPERATIONS_KEY, JSON.stringify(limitedOps));
  } catch (error) {
    console.error('Error persisting restore operations:', error);
  }
};

export const recordRestoreOperation = (operation: RestoreOperation): void => {
  const operations = readRestoreOperations();
  operations.push(operation);
  persistRestoreOperations(operations);
};

export const getRestoreOperation = (id: string): RestoreOperation | undefined => {
  return readRestoreOperations().find((o) => o.id === id);
};

export const getRestoreOperationsByBackup = (backupId: string): RestoreOperation[] => {
  return readRestoreOperations().filter((o) => o.backupId === backupId);
};

export const updateRestoreOperation = (id: string, updates: Partial<RestoreOperation>): void => {
  const operations = readRestoreOperations();
  const idx = operations.findIndex((o) => o.id === id);
  if (idx >= 0) {
    operations[idx] = { ...operations[idx], ...updates };
    persistRestoreOperations(operations);
  }
};

// Backup Verifications
export const readVerifications = (): BackupVerification[] => {
  try {
    const data = localStorage.getItem(BACKUP_VERIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistVerifications = (verifications: BackupVerification[]): void => {
  try {
    const limitedVerifications = verifications.slice(-100);
    localStorage.setItem(BACKUP_VERIFICATIONS_KEY, JSON.stringify(limitedVerifications));
  } catch (error) {
    console.error('Error persisting verifications:', error);
  }
};

export const recordVerification = (verification: BackupVerification): void => {
  const verifications = readVerifications();
  verifications.push(verification);
  persistVerifications(verifications);
};

export const getLatestVerification = (backupId: string): BackupVerification | undefined => {
  const verifications = readVerifications();
  return verifications
    .filter((v) => v.backupId === backupId)
    .sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime())[0];
};

// Retention Records
export const readRetentionRecords = (): RetentionRecord[] => {
  try {
    const data = localStorage.getItem(RETENTION_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistRetentionRecords = (records: RetentionRecord[]): void => {
  try {
    localStorage.setItem(RETENTION_RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error persisting retention records:', error);
  }
};

export const addRetentionRecord = (record: RetentionRecord): void => {
  const records = readRetentionRecords();
  records.push(record);
  persistRetentionRecords(records);
};

export const getExpiredBackups = (): RetentionRecord[] => {
  const records = readRetentionRecords();
  const now = new Date();
  return records.filter((r) => new Date(r.expiresAt) < now && !r.deletedAt);
};

// Disaster Recovery Plans
export const readDisasterPlans = (): DisasterRecoveryPlan[] => {
  try {
    const data = localStorage.getItem(DISASTER_PLANS_KEY);
    return data ? JSON.parse(data) : getDefaultDisasterPlan();
  } catch {
    return getDefaultDisasterPlan();
  }
};

export const getDefaultDisasterPlan = (): DisasterRecoveryPlan[] => {
  return [
    {
      id: 'drp-default',
      name: 'Standard DR Plan',
      description: 'Standard disaster recovery plan with daily backups',
      rtoMinutes: 60,
      rpoMinutes: 24 * 60, // 1 day
      backupTasks: [],
      testFrequency: 'monthly',
      status: 'active',
      contactEmails: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

export const persistDisasterPlans = (plans: DisasterRecoveryPlan[]): void => {
  try {
    localStorage.setItem(DISASTER_PLANS_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error('Error persisting disaster plans:', error);
  }
};

export const saveDisasterPlan = (plan: DisasterRecoveryPlan): void => {
  const plans = readDisasterPlans();
  const existing = plans.findIndex((p) => p.id === plan.id);
  if (existing >= 0) {
    plans[existing] = plan;
  } else {
    plans.push(plan);
  }
  persistDisasterPlans(plans);
};

// Preferences
export const readPreferences = (userId: string): BackupPreferences => {
  try {
    const data = localStorage.getItem(`${PREFERENCES_KEY}:${userId}`);
    if (data) return JSON.parse(data);
  } catch {
    // Continue with defaults
  }

  return {
    userId,
    autoStartBackups: true,
    notifyOnBackupStart: false,
    notifyOnBackupCompletion: true,
    notifyOnBackupFailure: true,
    parallelBackupTasks: 1,
    maxBackupDuration: 3600,
    verifyBackupsAfterCreation: true,
    bandwidthLimitMbps: undefined,
  };
};

export const persistPreferences = (preferences: BackupPreferences): void => {
  try {
    localStorage.setItem(`${PREFERENCES_KEY}:${preferences.userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error persisting preferences:', error);
  }
};

// Statistics
export const getBackupStats = (): BackupStats => {
  const metadata = readBackupMetadata();
  const completed = metadata.filter((m) => m.status === 'completed');
  const failed = metadata.filter((m) => m.status === 'failed');
  const restores = readRestoreOperations();
  const successfulRestores = restores.filter((r) => r.status === 'completed');

  const totalSize = metadata.reduce((sum, m) => sum + m.sizeBytes, 0);
  const totalTime = completed.reduce((sum, m) => sum + (m.duration || 0), 0);
  const avgTime = completed.length > 0 ? totalTime / completed.length : 0;

  const oldestBackup = metadata
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .at(0);
  const newestBackup = metadata
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .at(0);

  return {
    totalBackups: metadata.length,
    successfulBackups: completed.length,
    failedBackups: failed.length,
    totalStorageBytes: totalSize,
    oldestBackup: oldestBackup ? new Date(oldestBackup.timestamp) : undefined,
    newestBackup: newestBackup ? new Date(newestBackup.timestamp) : undefined,
    averageBackupTime: avgTime,
    successRate: metadata.length > 0 ? (completed.length / metadata.length) * 100 : 0,
    lastBackupStatus: metadata[metadata.length - 1]?.status || 'scheduled',
    totalRestores: restores.length,
    successfulRestores: successfulRestores.length,
  };
};

// Recovery Points
export const getRecoveryPoints = (): RecoveryPoint[] => {
  const metadata = readBackupMetadata();
  const verifications = readVerifications();

  return metadata
    .filter((m) => m.status === 'completed')
    .map((m) => {
      const verification = verifications.find((v) => v.backupId === m.backupId);
      return {
        backupId: m.backupId,
        timestamp: new Date(m.timestamp),
        type: m.type,
        status: m.status,
        recoveryTimeObjective: 30,
        recoveryPointObjective: 24 * 60,
        sizeBytes: m.sizeBytes,
        canRestore: verification?.recoverable ?? true,
        verificationStatus: verification?.isValid ? 'verified' : 'unverified',
      };
    });
}

// Cleanup and maintenance
export const cleanupExpiredBackups = (): number => {
  const expiredBackups = getExpiredBackups();
  let deletedCount = 0;

  expiredBackups.forEach((record) => {
    // Mark as deleted
    const records = readRetentionRecords();
    const idx = records.findIndex((r) => r.backupId === record.backupId);
    if (idx >= 0) {
      records[idx].deletedAt = new Date();
      persistRetentionRecords(records);
      deletedCount++;
    }
  });

  return deletedCount;
};
