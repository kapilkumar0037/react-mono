import { useEffect, useState, useCallback } from 'react';
import { DataChange, SyncStatus } from '../types/realtimeSync';
import { realtimeSyncManager } from '../utils/realtimeSync';

export const useRealtimeSync = (entityType: string, onDataChange?: (change: DataChange) => void) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    realtimeSyncManager.getStatus()
  );
  const [changes, setChanges] = useState<DataChange[]>([]);

  useEffect(() => {
    // Subscribe to changes
    const subId = realtimeSyncManager.subscribe(
      entityType,
      (change) => {
        setChanges((prev) => [change, ...prev].slice(0, 50)); // Keep last 50 changes
        if (onDataChange) {
          onDataChange(change);
        }
      }
    );

    // Start polling
    realtimeSyncManager.startPolling(2000);

    // Update sync status periodically
    const statusInterval = setInterval(() => {
      setSyncStatus(realtimeSyncManager.getStatus());
    }, 1000);

    return () => {
      if (subId) {
        realtimeSyncManager.unsubscribe(subId);
      }
      clearInterval(statusInterval);
    };
  }, [entityType, onDataChange]);

  const getChangeHistory = useCallback(() => {
    return realtimeSyncManager.getChangeHistory(entityType, 50);
  }, [entityType]);

  return {
    syncStatus,
    changes,
    getChangeHistory,
  };
};

export const useRealtimeSyncGlobal = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    realtimeSyncManager.getStatus()
  );

  useEffect(() => {
    // Start polling globally
    realtimeSyncManager.startPolling(2000);

    // Update sync status periodically
    const statusInterval = setInterval(() => {
      setSyncStatus(realtimeSyncManager.getStatus());
    }, 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  return {
    syncStatus,
    realtimeSyncManager,
  };
};
