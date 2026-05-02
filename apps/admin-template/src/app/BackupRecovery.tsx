import React, { useState } from 'react';
import { Card, Modal, useToast } from '@react-mono/ui-controls';
import { usePageAction } from './usePageAction';

interface Backup {
  id: number;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in-progress' | 'failed';
  size: string;
  date: string;
  time: string;
  duration: string;
  retentionDays: number;
}

interface BackupSchedule {
  id: number;
  name: string;
  frequency: string;
  backupType: 'full' | 'incremental' | 'differential';
  time: string;
  retentionDays: number;
  enabled: boolean;
  lastRun: string;
}

interface BackupRecoveryProps {
  isDarkMode?: boolean;
}

const BackupRecovery: React.FC<BackupRecoveryProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 1,
      name: 'Full Backup 2024-02-26',
      type: 'full',
      status: 'completed',
      size: '2.4 GB',
      date: '2024-02-26',
      time: '02:00 AM',
      duration: '45 minutes',
      retentionDays: 30,
    },
    {
      id: 2,
      name: 'Incremental Backup 2024-02-25',
      type: 'incremental',
      status: 'completed',
      size: '320 MB',
      date: '2024-02-25',
      time: '02:00 AM',
      duration: '8 minutes',
      retentionDays: 7,
    },
    {
      id: 3,
      name: 'Full Backup 2024-02-19',
      type: 'full',
      status: 'completed',
      size: '2.3 GB',
      date: '2024-02-19',
      time: '02:00 AM',
      duration: '42 minutes',
      retentionDays: 30,
    },
    {
      id: 4,
      name: 'Differential Backup 2024-02-18',
      type: 'differential',
      status: 'completed',
      size: '180 MB',
      date: '2024-02-18',
      time: '02:00 AM',
      duration: '5 minutes',
      retentionDays: 14,
    },
    {
      id: 5,
      name: 'Full Backup 2024-02-12',
      type: 'full',
      status: 'completed',
      size: '2.2 GB',
      date: '2024-02-12',
      time: '02:00 AM',
      duration: '40 minutes',
      retentionDays: 30,
    },
    {
      id: 6,
      name: 'Full Backup 2024-02-05',
      type: 'full',
      status: 'failed',
      size: '0 B',
      date: '2024-02-05',
      time: '02:00 AM',
      duration: '0 minutes',
      retentionDays: 0,
    },
  ]);

  const [schedules] = useState<BackupSchedule[]>([
    {
      id: 1,
      name: 'Daily Full Backup',
      frequency: 'Every day at 2:00 AM',
      backupType: 'full',
      time: '02:00',
      retentionDays: 30,
      enabled: true,
      lastRun: '2024-02-26 02:00 AM',
    },
    {
      id: 2,
      name: 'Incremental Backup',
      frequency: 'Every day at 6:00 PM',
      backupType: 'incremental',
      time: '18:00',
      retentionDays: 7,
      enabled: true,
      lastRun: '2024-02-25 06:00 PM',
    },
    {
      id: 3,
      name: 'Weekly Differential',
      frequency: 'Every Sunday at 1:00 AM',
      backupType: 'differential',
      time: '01:00',
      retentionDays: 14,
      enabled: false,
      lastRun: 'Never run',
    },
  ]);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [backupPendingDelete, setBackupPendingDelete] = useState<Backup | null>(null);

  const createBackup = () => {
    const nextBackup: Backup = {
      id: Math.max(...backups.map((backup) => backup.id), 0) + 1,
      name: `Full Backup ${new Date().toISOString().split('T')[0]}`,
      type: 'full',
      status: 'in-progress',
      size: 'Pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'Starting',
      retentionDays: 30,
    };

    setBackups((currentBackups) => [nextBackup, ...currentBackups]);
    showToast({
      message: 'Manual backup started. The new backup has been added to history.',
      variant: 'success',
    });
  };

  usePageAction('create-backup', createBackup);

  const backupStats = [
    { label: 'Total Backups', value: backups.length.toString(), color: 'blue' },
    { label: 'Successful', value: backups.filter(b => b.status === 'completed').length.toString(), color: 'green' },
    { label: 'Failed', value: backups.filter(b => b.status === 'failed').length.toString(), color: 'red' },
    { label: 'Total Size', value: '12.4 GB', color: 'purple' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'incremental':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'differential':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-l-4 border-blue-500';
      case 'green':
        return 'border-l-4 border-green-500';
      case 'red':
        return 'border-l-4 border-red-500';
      case 'purple':
        return 'border-l-4 border-purple-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  const deleteBackup = (id: number) => {
    const backupToDelete = backups.find((backup) => backup.id === id);
    setBackups(backups.filter(b => b.id !== id));

    if (backupToDelete) {
      showToast({
        message: `${backupToDelete.name} was deleted from backup history.`,
        variant: 'info',
      });
    }
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Backup & Recovery
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage system backups, schedules, and data recovery
            </p>
          </div>
          <button
            onClick={createBackup}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Create Backup
          </button>
        </div>

        {/* Backup Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {backupStats.map((stat, idx) => (
            <Card key={idx} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} ${getStatColor(stat.color)}`}>
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Backup Schedules */}
          <Card title="Backup Schedules" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-3 rounded border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {schedule.name}
                      </h4>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {schedule.frequency}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(schedule.backupType)}`}>
                          {schedule.backupType.charAt(0).toUpperCase() + schedule.backupType.slice(1)}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Retention: {schedule.retentionDays} days
                        </span>
                      </div>
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Last run: {schedule.lastRun}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={schedule.enabled}
                        className="w-4 h-4 rounded"
                      />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {schedule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className={`w-full py-2 px-3 rounded border text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-blue-400 hover:bg-gray-700'
                    : 'border-gray-300 text-blue-600 hover:bg-gray-50'
                }`}
              >
                + Add Schedule
              </button>
              {showScheduleForm && (
                <div className={`rounded border p-3 text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                  Schedule builder is the next step here. For now, this confirms where the schedule form will live.
                </div>
              )}
            </div>
          </Card>

          {/* Recovery Points */}
          <Card title="Storage & Retention" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Backup Storage
                  </label>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    12.4 GB / 100 GB
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-full bg-blue-600" style={{ width: '12.4%' }}></div>
                </div>
              </div>

              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${isDarkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  <span className="font-semibold">12.4% Used</span> - 87.6 GB available
                </p>
              </div>

              <div className="space-y-2">
                <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quick Stats
                </h5>
                <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>• Oldest backup: 2024-02-05</p>
                  <p>• Average backup size: 360 MB</p>
                  <p>• Fastest backup: 5 minutes</p>
                  <p>• Slowest backup: 45 minutes</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Backup History */}
        <Card title="Backup History" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Backup Name
                  </th>
                  <th className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </th>
                  <th className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date & Time
                  </th>
                  <th className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Size
                  </th>
                  <th className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Duration
                  </th>
                  <th className={`px-4 py-3 text-center font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr
                    key={backup.id}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {backup.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeColor(backup.type)}`}>
                        {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(backup.status)}`}>
                        {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {backup.date} {backup.time}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {backup.size}
                    </td>
                    <td className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {backup.duration}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedBackup(backup)}
                          title="Restore"
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            backup.status === 'completed'
                              ? isDarkMode
                                ? 'bg-blue-900 text-blue-200 hover:bg-blue-800'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : isDarkMode
                              ? 'bg-gray-700 text-gray-500'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          disabled={backup.status !== 'completed'}
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => setBackupPendingDelete(backup)}
                          title="Delete"
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            isDarkMode
                              ? 'bg-red-900 text-red-200 hover:bg-red-800'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={selectedBackup !== null}
          onClose={() => setSelectedBackup(null)}
          title="Restore from Backup"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedBackup
                ? `Are you sure you want to restore from "${selectedBackup.name}"? This mock action would overwrite current data.`
                : 'Are you sure you want to restore from this backup?'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBackup(null)}
                className={`flex-1 px-4 py-2 rounded border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedBackup) {
                    showToast({
                      message: `Restore started from ${selectedBackup.name}.`,
                      variant: 'warning',
                    });
                  }
                  setSelectedBackup(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={backupPendingDelete !== null}
          onClose={() => setBackupPendingDelete(null)}
          title="Delete Backup"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {backupPendingDelete
                ? `Delete "${backupPendingDelete.name}" from backup history?`
                : 'Delete this backup from backup history?'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setBackupPendingDelete(null)}
                className={`flex-1 px-4 py-2 rounded border transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (backupPendingDelete) {
                    deleteBackup(backupPendingDelete.id);
                  }
                  setBackupPendingDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BackupRecovery;
