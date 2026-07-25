/**
 * BackupRecoveryPage Component
 * Main page for backup and disaster recovery management
 */

import React, { useState, useEffect } from 'react';
import { useBackup } from '../hooks/useBackup';
import { BackupTask, BackupMetadata } from '../types/backup';
import { BackupScheduler } from '../components/BackupScheduler';
import { BackupHistory } from '../components/BackupHistory';
import { RestoreWizard } from '../components/RestoreWizard';
import { BackupOverview } from '../components/BackupOverview';
import { useGlobalToast } from '../hooks/useGlobalToast';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const BackupRecoveryPage: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) => {
  const userId = 'user-123';
  const { addToast } = useGlobalToast();
  const backup = useBackup(userId);

  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'history' | 'restore'>('overview');
  const [editingTask, setEditingTask] = useState<BackupTask | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize mock backup tasks on first load
  useEffect(() => {
    if (backup.tasks.length === 0) {
      const mockTasks: BackupTask[] = [
        {
          id: `task-${generateId()}`,
          name: 'Daily Database Full Backup',
          description: 'Complete database backup every day at 2 AM',
          schedule: {
            frequency: 'daily',
            time: '02:00',
          },
          backupType: 'full',
          destination: 'cloud_s3',
          includeEntityTypes: ['users', 'orders', 'customers'],
          retentionPolicy: '30days',
          isActive: true,
          compressionEnabled: true,
          encryptionEnabled: true,
          notifyOnCompletion: true,
          notifyOnFailure: true,
          notificationEmails: ['admin@example.com'],
          lastBackupTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          nextScheduledTime: new Date(Date.now() + 22 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
        {
          id: `task-${generateId()}`,
          name: 'Weekly Incremental Backup',
          description: 'Incremental backup every Sunday at 3 AM',
          schedule: {
            frequency: 'weekly',
            time: '03:00',
            daysOfWeek: [0],
          },
          backupType: 'incremental',
          destination: 'nas',
          includeEntityTypes: ['orders', 'invoices'],
          retentionPolicy: '90days',
          isActive: true,
          compressionEnabled: true,
          encryptionEnabled: false,
          notifyOnCompletion: false,
          notifyOnFailure: true,
          notificationEmails: ['backup-team@example.com'],
          lastBackupTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          nextScheduledTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
        {
          id: `task-${generateId()}`,
          name: 'Monthly Snapshot',
          description: 'Full snapshot backup on the 1st of each month',
          schedule: {
            frequency: 'monthly',
            time: '01:00',
            dayOfMonth: 1,
          },
          backupType: 'snapshot',
          destination: 'cloud_azure',
          includeEntityTypes: ['users', 'orders', 'customers', 'products', 'invoices'],
          retentionPolicy: '1year',
          isActive: true,
          compressionEnabled: true,
          encryptionEnabled: true,
          notifyOnCompletion: true,
          notifyOnFailure: true,
          notificationEmails: ['admin@example.com', 'cto@example.com'],
          lastBackupTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          nextScheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
      ];

      mockTasks.forEach((task) => backup.createBackupTask(task));

      // Create mock backup executions
      mockTasks.forEach((task) => {
        for (let i = 0; i < 5; i++) {
          backup.executeBackup(task.id);
        }
      });
    }
  }, []);

  const handleCreateNewTask = () => {
    const newTask: BackupTask = {
      id: `task-${generateId()}`,
      name: 'New Backup Task',
      schedule: {
        frequency: 'daily',
        time: '02:00',
      },
      backupType: 'full',
      destination: 'local',
      includeEntityTypes: [],
      retentionPolicy: '30days',
      isActive: false,
      compressionEnabled: true,
      encryptionEnabled: true,
      notifyOnCompletion: false,
      notifyOnFailure: true,
      notificationEmails: [],
      createdAt: new Date(),
      createdBy: userId,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    setEditingTask(newTask);
    setActiveTab('schedule');
  };

  const handleSaveTask = (task: BackupTask) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingTask?.id === task.id && backup.tasks.find((t: BackupTask) => t.id === task.id)) {
        backup.updateBackupTask(task.id, task);
        addToast('Backup task updated successfully', 'success');
      } else {
        backup.createBackupTask(task);
        addToast('Backup task created successfully', 'success');
      }
      setEditingTask(null);
      setActiveTab('overview');
      setIsLoading(false);
    }, 500);
  };

  const handleExecuteBackup = (taskId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      backup.executeBackup(taskId);
      addToast('Backup execution started', 'info');
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTask = (taskId: string) => {
    backup.deleteBackupTask(taskId);
    addToast('Backup task deleted', 'info');
  };

  const handleVerifyBackup = (backupId: string) => {
    backup.verifyBackup(backupId);
    addToast('Backup verification started', 'info');
  };

  const handleRestoreBackup = (backupId: string, env: 'dev' | 'staging' | 'production', entities: string[]) => {
    setIsLoading(true);
    setTimeout(() => {
      backup.initiateRestore(backupId, env, entities);
      addToast('Restore operation initiated', 'info');
      setEditingTask(null);
      setSelectedBackup(null);
      setActiveTab('overview');
      setIsLoading(false);
    }, 1500);
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';

  return (
    <div className={`${bgClass} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Backup & Disaster Recovery</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Manage backups, recovery points, and disaster recovery planning
            </p>
          </div>
          <button
            onClick={handleCreateNewTask}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + New Backup Task
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-300 dark:border-gray-700">
          {(['overview', 'schedule', 'history', 'restore'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? isDarkMode
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'schedule' && (editingTask ? 'Edit Task' : 'Schedule')}
              {tab === 'history' && `History (${backup.backups.length})`}
              {tab === 'restore' && 'Restore'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <BackupOverview
            tasks={backup.tasks}
            stats={backup.stats}
            onExecuteBackup={handleExecuteBackup}
            onEditTask={(task: BackupTask) => {
              setEditingTask(task);
              setActiveTab('schedule');
            }}
            onDeleteTask={handleDeleteTask}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'schedule' && editingTask && (
          <BackupScheduler
            task={editingTask}
            onTaskChange={setEditingTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setEditingTask(null);
              setActiveTab('overview');
            }}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'history' && (
          <BackupHistory
            backups={backup.backups}
            onVerifyBackup={handleVerifyBackup}
            onRestoreBackup={(b: BackupMetadata) => {
              setSelectedBackup(b);
              setActiveTab('restore');
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'restore' && (
          <RestoreWizard
            recoveryPoints={backup.recoveryPoints}
            selectedBackup={selectedBackup}
            onRestore={handleRestoreBackup}
            onCancel={() => {
              setSelectedBackup(null);
              setActiveTab('history');
            }}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};
