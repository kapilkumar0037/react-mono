/**
 * useBackup Hook
 * Manages backup tasks, restore operations, and recovery points
 */

import { useState, useCallback, useEffect } from 'react';
import {
  BackupTask,
  BackupMetadata,
  RestoreOperation,
  BackupStats,
  BackupVerification,
  BackupPreferences,
  DisasterRecoveryPlan,
  RecoveryPoint,
  BackupStatus,
} from '../types/backup';
import {
  readBackupTasks,
  saveBackupTask,
  getBackupTask,
  deleteBackupTask,
  readBackupMetadata,
  recordBackupMetadata,
  getBackupsByStatus,
  readRestoreOperations,
  recordRestoreOperation,
  updateRestoreOperation,
  readVerifications,
  recordVerification,
  readPreferences,
  persistPreferences,
  getBackupStats,
  readDisasterPlans,
  saveDisasterPlan,
  getRecoveryPoints,
  cleanupExpiredBackups,
} from '../utils/backupStorage';

export const useBackup = (userId: string) => {
  const [tasks, setTasks] = useState<BackupTask[]>([]);
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [restoreOps, setRestoreOps] = useState<RestoreOperation[]>([]);
  const [verifications, setVerifications] = useState<BackupVerification[]>([]);
  const [preferences, setPreferences] = useState<BackupPreferences | null>(null);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [recoveryPoints, setRecoveryPoints] = useState<RecoveryPoint[]>([]);
  const [disasterPlans, setDisasterPlans] = useState<DisasterRecoveryPlan[]>([]);

  // Load data on mount
  useEffect(() => {
    setTasks(readBackupTasks());
    setBackups(readBackupMetadata());
    setRestoreOps(readRestoreOperations());
    setVerifications(readVerifications());
    setPreferences(readPreferences(userId));
    setStats(getBackupStats());
    setRecoveryPoints(getRecoveryPoints());
    setDisasterPlans(readDisasterPlans());
  }, [userId]);

  // Task Management
  const createBackupTask = useCallback((task: BackupTask) => {
    saveBackupTask(task);
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateBackupTask = useCallback((id: string, updates: Partial<BackupTask>) => {
    const task = getBackupTask(id);
    if (task) {
      const updated = { ...task, ...updates, updatedAt: new Date() };
      saveBackupTask(updated);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  }, []);

  const deleteBackupTask_fn = useCallback((id: string) => {
    deleteBackupTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Backup Execution
  const executeBackup = useCallback((taskId: string) => {
    const task = getBackupTask(taskId);
    if (!task) return null;

    const startTime = Date.now();
    const backup: BackupMetadata = {
      backupId: `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: task.backupType,
      status: BackupStatus.RUNNING,
      sizeBytes: 0,
      recordCount: Math.floor(Math.random() * 10000) + 1000,
      entityTypes: task.includeEntityTypes,
      checksum: Math.random().toString(36).substr(2, 12),
    };

    recordBackupMetadata(backup);
    setBackups((prev) => [...prev, backup]);

    // Simulate backup completion
    setTimeout(() => {
      const completedBackup: BackupMetadata = {
        ...backup,
        status: BackupStatus.COMPLETED,
        sizeBytes: Math.floor(Math.random() * 100000000) + 10000000,
        completedAt: new Date(),
        duration: Date.now() - startTime,
      };

      recordBackupMetadata(completedBackup);
      setBackups((prev) =>
        prev.map((b) => (b.backupId === backup.backupId ? completedBackup : b)),
      );

      // Auto-verify if enabled
      if (preferences?.verifyBackupsAfterCreation) {
        const verification: BackupVerification = {
          backupId: backup.backupId,
          verifiedAt: new Date(),
          isValid: true,
          checksumMatch: true,
          recoverable: true,
          issues: [],
        };
        recordVerification(verification);
        setVerifications((prev) => [...prev, verification]);
      }

      // Update task's last backup
      updateBackupTask(taskId, {
        lastBackupId: backup.backupId,
        lastBackupTime: new Date(),
        nextScheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      refreshStats();
    }, 2000);

    return backup;
  }, [preferences, updateBackupTask]);

  // Restore Operations
  const initiateRestore = useCallback(
    (backupId: string, targetEnv: 'dev' | 'staging' | 'production', entityTypes: string[]) => {
      const backup = backups.find((b) => b.backupId === backupId);
      if (!backup) return null;

      const restore: RestoreOperation = {
        id: `restore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        backupId,
        backupTimestamp: new Date(backup.timestamp),
        status: 'pending',
        targetEnvironment: targetEnv,
        selectedEntityTypes: entityTypes,
      };

      recordRestoreOperation(restore);
      setRestoreOps((prev) => [...prev, restore]);

      // Simulate restore execution
      setTimeout(() => {
        const startTime = Date.now();
        const inProgressRestore: RestoreOperation = {
          ...restore,
          status: 'in_progress',
          startedAt: new Date(),
        };
        updateRestoreOperation(restore.id, inProgressRestore);
        setRestoreOps((prev) =>
          prev.map((r) => (r.id === restore.id ? inProgressRestore : r)),
        );

        // Complete restore
        setTimeout(() => {
          const completedRestore: RestoreOperation = {
            ...restore,
            status: 'completed',
            completedAt: new Date(),
            duration: Date.now() - startTime,
            recordsRestored: backup.recordCount,
            verificationStatus: 'passed',
          };
          updateRestoreOperation(restore.id, completedRestore);
          setRestoreOps((prev) =>
            prev.map((r) => (r.id === restore.id ? completedRestore : r)),
          );
          refreshStats();
        }, 2500);
      }, 1000);

      return restore;
    },
    [backups],
  );

  // Verification
  const verifyBackup = useCallback((backupId: string) => {
    const verification: BackupVerification = {
      backupId,
      verifiedAt: new Date(),
      isValid: Math.random() > 0.1, // 90% success rate
      checksumMatch: true,
      recoverable: true,
      issues: [],
      warnings: Math.random() > 0.9 ? ['Consider recompressing backup'] : undefined,
    };

    recordVerification(verification);
    setVerifications((prev) => [...prev, verification]);
    return verification;
  }, []);

  // Get Backups by Status
  const getBackupsByStatus_fn = useCallback((status: BackupStatus) => {
    return getBackupsByStatus(status);
  }, []);

  // Statistics
  const refreshStats = useCallback(() => {
    const newStats = getBackupStats();
    setStats(newStats);
    setRecoveryPoints(getRecoveryPoints());
  }, []);

  // Preferences
  const updatePreferences_fn = useCallback((newPrefs: Partial<BackupPreferences>) => {
    if (preferences) {
      const updated = { ...preferences, ...newPrefs };
      persistPreferences(updated);
      setPreferences(updated);
    }
  }, [preferences]);

  // Disaster Plans
  const updateDisasterPlan = useCallback((plan: DisasterRecoveryPlan) => {
    saveDisasterPlan(plan);
    setDisasterPlans((prev) =>
      prev.map((p) => (p.id === plan.id ? plan : p)),
    );
  }, []);

  // Cleanup
  const cleanupExpired = useCallback(() => {
    return cleanupExpiredBackups();
  }, []);

  return {
    // State
    tasks,
    backups,
    restoreOps,
    verifications,
    preferences,
    stats,
    recoveryPoints,
    disasterPlans,

    // Task management
    createBackupTask,
    updateBackupTask,
    deleteBackupTask: deleteBackupTask_fn,

    // Backup operations
    executeBackup,
    getBackupsByStatus: getBackupsByStatus_fn,

    // Restore operations
    initiateRestore,

    // Verification
    verifyBackup,

    // Preferences
    updatePreferences: updatePreferences_fn,

    // Disaster plans
    updateDisasterPlan,

    // Stats and cleanup
    refreshStats,
    cleanupExpired,
  };
};
