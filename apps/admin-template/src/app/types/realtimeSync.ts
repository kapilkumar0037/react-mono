/**
 * Real-time Data Synchronization Types
 */

export enum DataChangeType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_UPDATE = 'BULK_UPDATE',
  SYNC = 'SYNC',
}

export interface DataChange {
  id: string;
  timestamp: number;
  entityType: string; // 'User', 'Order', 'Customer', etc.
  changeType: DataChangeType;
  entityId: string;
  previousData?: Record<string, any>;
  newData: Record<string, any>;
  changedFields?: string[];
  changedBy: string;
  metadata?: Record<string, any>;
}

export interface RealtimeDataEvent {
  id: string;
  timestamp: number;
  changes: DataChange[];
  connectionId: string;
  batchSize: number;
}

export interface DataSyncSubscriber {
  id: string;
  entityType: string;
  callback: (change: DataChange) => void;
  filter?: (change: DataChange) => boolean;
}

export interface SyncStatus {
  isConnected: boolean;
  lastSync: number;
  pendingChanges: number;
  failedAttempts: number;
  averageLatency: number;
}
