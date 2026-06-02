/**
 * BackupScheduler Component
 * UI for creating and configuring backup tasks
 */

import React, { useState } from 'react';
import {
  BackupTask,
  BackupFrequency,
  BackupType,
  BackupDestination,
  RetentionPolicy,
} from '../types/backup';

interface BackupSchedulerProps {
  task: BackupTask;
  onTaskChange: (task: BackupTask) => void;
  onSave: (task: BackupTask) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const BackupScheduler: React.FC<BackupSchedulerProps> = ({
  task,
  onTaskChange,
  onSave,
  onCancel,
  isLoading = false,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'schedule' | 'options'>('basic');

  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg border p-6`}>
      <h2 className="mb-4 text-2xl font-bold">Backup Scheduler</h2>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-300 dark:border-gray-700">
        {(['basic', 'schedule', 'options'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? isDarkMode
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-blue-600 text-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Name *</label>
            <input
              type="text"
              value={task.name}
              onChange={(e) => onTaskChange({ ...task, name: e.target.value })}
              placeholder="e.g., Daily Database Backup"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={task.description || ''}
              onChange={(e) => onTaskChange({ ...task, description: e.target.value })}
              placeholder="Describe this backup task..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Backup Type *</label>
              <select
                value={task.backupType}
                onChange={(e) => onTaskChange({ ...task, backupType: e.target.value as BackupType })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              >
                <option value="full">Full</option>
                <option value="incremental">Incremental</option>
                <option value="differential">Differential</option>
                <option value="snapshot">Snapshot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Destination *</label>
              <select
                value={task.destination}
                onChange={(e) => onTaskChange({ ...task, destination: e.target.value as BackupDestination })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              >
                <option value="local">Local Storage</option>
                <option value="cloud_s3">AWS S3</option>
                <option value="cloud_azure">Azure Blob</option>
                <option value="sftp">SFTP Server</option>
                <option value="nas">NAS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Entity Types to Backup</label>
            <div className="space-y-2">
              {['users', 'orders', 'customers', 'products', 'invoices'].map((entity) => (
                <label key={entity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.includeEntityTypes.includes(entity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onTaskChange({
                          ...task,
                          includeEntityTypes: [...task.includeEntityTypes, entity],
                        });
                      } else {
                        onTaskChange({
                          ...task,
                          includeEntityTypes: task.includeEntityTypes.filter((e) => e !== entity),
                        });
                      }
                    }}
                    className="h-4 w-4 rounded"
                  />
                  <span className="ml-2 text-sm capitalize">{entity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.isActive}
              onChange={(e) => onTaskChange({ ...task, isActive: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            <label className="ml-2 text-sm font-medium">Active</label>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Frequency *</label>
            <select
              value={task.schedule.frequency}
              onChange={(e) =>
                onTaskChange({
                  ...task,
                  schedule: { ...task.schedule, frequency: e.target.value as BackupFrequency },
                })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="on_demand">On Demand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time (HH:mm) *</label>
            <input
              type="time"
              value={task.schedule.time}
              onChange={(e) =>
                onTaskChange({
                  ...task,
                  schedule: { ...task.schedule, time: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          {task.schedule.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-2">Days of Week</label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <label key={day} className="text-center">
                    <input
                      type="checkbox"
                      checked={task.schedule.daysOfWeek?.includes(idx) || false}
                      onChange={(e) => {
                        const daysOfWeek = task.schedule.daysOfWeek || [];
                        if (e.target.checked) {
                          daysOfWeek.push(idx);
                        } else {
                          daysOfWeek.splice(daysOfWeek.indexOf(idx), 1);
                        }
                        onTaskChange({
                          ...task,
                          schedule: { ...task.schedule, daysOfWeek },
                        });
                      }}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-xs mt-1 block">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {task.schedule.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium mb-1">Day of Month (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={task.schedule.dayOfMonth || 1}
                onChange={(e) =>
                  onTaskChange({
                    ...task,
                    schedule: { ...task.schedule, dayOfMonth: parseInt(e.target.value) },
                  })
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Options Tab */}
      {activeTab === 'options' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Retention Policy *</label>
            <select
              value={task.retentionPolicy}
              onChange={(e) => onTaskChange({ ...task, retentionPolicy: e.target.value as RetentionPolicy })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
              <option value="1year">1 Year</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={task.compressionEnabled}
                onChange={(e) => onTaskChange({ ...task, compressionEnabled: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <span className="ml-2 text-sm font-medium">Enable Compression</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={task.encryptionEnabled}
                onChange={(e) => onTaskChange({ ...task, encryptionEnabled: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <span className="ml-2 text-sm font-medium">Enable Encryption</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={task.notifyOnCompletion}
                onChange={(e) => onTaskChange({ ...task, notifyOnCompletion: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <span className="ml-2 text-sm font-medium">Notify on Completion</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={task.notifyOnFailure}
                onChange={(e) => onTaskChange({ ...task, notifyOnFailure: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <span className="ml-2 text-sm font-medium">Notify on Failure</span>
            </label>
          </div>

          {(task.notifyOnCompletion || task.notifyOnFailure) && (
            <div>
              <label className="block text-sm font-medium mb-1">Notification Emails</label>
              <input
                type="text"
                value={task.notificationEmails.join(', ')}
                onChange={(e) =>
                  onTaskChange({
                    ...task,
                    notificationEmails: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                placeholder="admin@example.com, backup@example.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(task)}
          disabled={isLoading || !task.name || task.includeEntityTypes.length === 0}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </div>
  );
};
