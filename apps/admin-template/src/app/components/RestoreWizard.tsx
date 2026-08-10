/**
 * RestoreWizard Component
 * Multi-step wizard for restoring from backup
 */

import React, { useState } from 'react';
import { BackupMetadata, RecoveryPoint } from '../types/backup';

interface RestoreWizardProps {
  recoveryPoints: RecoveryPoint[];
  selectedBackup: BackupMetadata | null;
  onRestore: (backupId: string, env: 'dev' | 'staging' | 'production', entities: string[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const RestoreWizard: React.FC<RestoreWizardProps> = ({
  recoveryPoints,
  selectedBackup,
  onRestore,
  onCancel,
  isLoading = false,
  isDarkMode = false,
}) => {
  const [step, setStep] = useState(1);
  const [selectedBackupId, setSelectedBackupId] = useState(selectedBackup?.backupId || '');
  const [targetEnv, setTargetEnv] = useState<'dev' | 'staging' | 'production'>('staging');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);

  const allEntities = ['users', 'orders', 'customers', 'products', 'invoices'];

  const handleEntityToggle = (entity: string) => {
    if (selectedEntities.includes(entity)) {
      setSelectedEntities(selectedEntities.filter((e) => e !== entity));
    } else {
      setSelectedEntities([...selectedEntities, entity]);
    }
  };

  const handleRestore = () => {
    if (selectedBackupId && selectedEntities.length > 0) {
      onRestore(selectedBackupId, targetEnv, selectedEntities);
    }
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className={`${bgClass} rounded-lg border p-6 max-w-2xl`}>
      <h2 className="mb-6 text-2xl font-bold">Restore Wizard</h2>

      {/* Progress */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full font-semibold flex items-center justify-center transition-colors ${
                s === step
                  ? 'bg-blue-600 text-white'
                  : s < step
                    ? 'bg-green-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? 'bg-green-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-64">
        {/* Step 1: Select Backup */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Select Recovery Point</h3>
            <div className="space-y-3">
              {recoveryPoints.length === 0 ? (
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No recovery points available</p>
              ) : (
                recoveryPoints.map((rp) => (
                  <label
                    key={rp.backupId}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBackupId === rp.backupId
                        ? isDarkMode
                          ? 'bg-blue-900 border-blue-600'
                          : 'bg-blue-50 border-blue-400'
                        : cardClass
                    }`}
                  >
                    <input
                      type="radio"
                      name="backup"
                      value={rp.backupId}
                      checked={selectedBackupId === rp.backupId}
                      onChange={(e) => setSelectedBackupId(e.target.value)}
                      className="h-4 w-4 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium">{rp.backupId.substring(0, 12)}...</div>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(rp.timestamp).toLocaleString()} • {rp.type} • {(rp.sizeBytes / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="text-xs mt-2">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            rp.verificationStatus === 'verified'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {rp.verificationStatus === 'verified' ? '✓ Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Target */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Select Target Environment</h3>
            <div className="space-y-3">
              {['dev', 'staging', 'production'].map((env) => (
                <label
                  key={env}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    targetEnv === env
                      ? isDarkMode
                        ? 'bg-blue-900 border-blue-600'
                        : 'bg-blue-50 border-blue-400'
                      : cardClass
                  }`}
                >
                  <input
                    type="radio"
                    name="env"
                    value={env}
                    checked={targetEnv === env as any}
                    onChange={(e) => setTargetEnv(e.target.value as any)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="ml-3 font-medium capitalize">{env}</span>
                  {env === 'production' && (
                    <span className="ml-auto text-xs font-semibold text-red-600 dark:text-red-400">
                      ⚠ CAUTION
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-800'}`}>
              <p className="text-sm">
                ⚠ Restoring to {targetEnv} will overwrite existing data in that environment. Make sure you have backups!
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Select Entities */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Select Data to Restore</h3>
            <div className="space-y-3">
              {allEntities.map((entity) => (
                <label key={entity} className="flex items-center p-3 border rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEntities.includes(entity)}
                    onChange={() => handleEntityToggle(entity)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="ml-3 font-medium capitalize">{entity}</span>
                </label>
              ))}
            </div>

            <div className={`mt-4 p-4 rounded-lg ${cardClass}`}>
              <p className="text-sm font-medium">Summary</p>
              <div className="text-sm mt-2 opacity-75">
                <p>Backup: {selectedBackupId.substring(0, 12)}...</p>
                <p>Environment: <span className="font-medium">{targetEnv}</span></p>
                <p>Entities: <span className="font-medium">{selectedEntities.length} selected</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
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

        <div className="flex gap-2">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Previous
          </button>

          {step === 3 ? (
            <button
              onClick={handleRestore}
              disabled={isLoading || selectedEntities.length === 0}
              className="px-4 py-2 rounded-md font-medium bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isLoading ? 'Restoring...' : 'Start Restore'}
            </button>
          ) : (
            <button
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={!selectedBackupId}
              className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
