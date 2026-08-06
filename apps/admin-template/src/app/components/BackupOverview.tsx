/**
 * BackupOverview Component
 * Dashboard showing backup status, tasks, and recovery points
 */

import React, { useState } from 'react';
import { BackupTask, BackupStats } from '../types/backup';

interface BackupOverviewProps {
  tasks: BackupTask[];
  stats: BackupStats | null;
  onExecuteBackup: (taskId: string) => void;
  onEditTask: (task: BackupTask) => void;
  onDeleteTask: (taskId: string) => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const BackupOverview: React.FC<BackupOverviewProps> = ({
  tasks,
  stats,
  onExecuteBackup,
  onEditTask,
  onDeleteTask,
  isLoading = false,
  isDarkMode = false,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-6 text-2xl font-bold">Backup Overview</h2>

      {/* Statistics Grid */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">Total Backups</div>
            <div className="mt-2 text-3xl font-bold">{stats.totalBackups}</div>
          </div>
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">✓ Successful</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.successfulBackups}</div>
          </div>
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">✗ Failed</div>
            <div className="mt-2 text-3xl font-bold text-red-600">{stats.failedBackups}</div>
          </div>
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">Success Rate</div>
            <div className="mt-2 text-3xl font-bold">{Math.round(stats.successRate)}%</div>
          </div>
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">Avg Duration</div>
            <div className="mt-2 text-3xl font-bold">{Math.round(stats.averageBackupTime / 1000)}s</div>
          </div>
          <div className={`rounded-lg border p-4 ${cardClass}`}>
            <div className="text-sm font-medium opacity-75">Total Size</div>
            <div className="mt-2 text-3xl font-bold">{(stats.totalStorageBytes / 1024 / 1024 / 1024).toFixed(2)} GB</div>
          </div>
        </div>
      )}

      {/* Backup Tasks */}
      <h3 className="text-xl font-bold mb-4">Active Backup Tasks</h3>

      {tasks.length === 0 ? (
        <div className={`text-center py-12 rounded-lg border ${cardClass}`}>
          <p className="text-lg font-medium">No backup tasks configured</p>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Create your first backup task to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-lg border p-4 transition-all ${
                task.isActive ? cardClass : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{task.name}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      task.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                  <button
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-sm"
                  >
                    {expandedTaskId === task.id ? '▼' : '▶'}
                  </button>
                </div>
              </div>

              {/* Summary Row */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Type:</span>
                  <div className="font-medium capitalize">{task.backupType}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Frequency:</span>
                  <div className="font-medium capitalize">{task.schedule.frequency}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Destination:</span>
                  <div className="font-medium capitalize">{task.destination.replace(/_/g, ' ')}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Retention:</span>
                  <div className="font-medium">{task.retentionPolicy}</div>
                </div>
              </div>

              {/* Last Backup Info */}
              {task.lastBackupTime && (
                <div className={`mt-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last backup:{' '}
                  {new Date(task.lastBackupTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {task.nextScheduledTime && (
                    <>
                      {' • '}Next scheduled:{' '}
                      {new Date(task.nextScheduledTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  )}
                </div>
              )}

              {/* Expanded Details */}
              {expandedTaskId === task.id && (
                <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
                    <div>
                      <span className="font-medium">Schedule:</span>
                      <div>{task.schedule.time} daily</div>
                    </div>
                    <div>
                      <span className="font-medium">Entities:</span>
                      <div>{task.includeEntityTypes.join(', ')}</div>
                    </div>
                    <div>
                      <span className="font-medium">Compression:</span>
                      <div>{task.compressionEnabled ? '✓ Enabled' : '✗ Disabled'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Encryption:</span>
                      <div>{task.encryptionEnabled ? '✓ Enabled' : '✗ Disabled'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onExecuteBackup(task.id)}
                      disabled={isLoading}
                      className="flex-1 rounded-md px-3 py-2 text-xs font-medium bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      Run Now
                    </button>
                    <button
                      onClick={() => onEditTask(task)}
                      className="flex-1 rounded-md px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this backup task?')) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="flex-1 rounded-md px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
