import {
  DataChange,
  DataChangeType,
  DataSyncSubscriber,
  SyncStatus,
} from '../types/realtimeSync';

class RealtimeSyncManager {
  private subscribers: Map<string, DataSyncSubscriber> = new Map();
  private changeHistory: DataChange[] = [];
  private isConnected: boolean = true;
  private lastSync: number = Date.now();
  private failedAttempts: number = 0;
  private pendingChanges: DataChange[] = [];
  private pollingInterval: NodeJS.Timeout | null = null;
  private latencies: number[] = [];

  /**
   * Subscribe to data changes for a specific entity type
   */
  public subscribe(
    entityType: string,
    callback: (change: DataChange) => void,
    filter?: (change: DataChange) => boolean
  ): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscribers.set(id, {
      id,
      entityType,
      callback,
      filter,
    });
    return id;
  }

  /**
   * Unsubscribe from data changes
   */
  public unsubscribe(id: string): boolean {
    return this.subscribers.delete(id);
  }

  /**
   * Start real-time synchronization polling
   */
  public startPolling(intervalMs: number = 2000): void {
    if (this.pollingInterval) {
      return; // Already polling
    }

    this.pollingInterval = setInterval(() => {
      this.syncData();
    }, intervalMs);
  }

  /**
   * Stop real-time synchronization polling
   */
  public stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Broadcast a data change to all subscribers
   */
  public broadcastChange(change: DataChange): void {
    this.changeHistory.push(change);
    this.pendingChanges.push(change);

    // Keep only last 500 changes
    if (this.changeHistory.length > 500) {
      this.changeHistory = this.changeHistory.slice(-500);
    }

    // Notify subscribers
    for (const subscriber of this.subscribers.values()) {
      if (
        subscriber.entityType === change.entityType ||
        subscriber.entityType === '*'
      ) {
        if (!subscriber.filter || subscriber.filter(change)) {
          subscriber.callback(change);
        }
      }
    }
  }

  /**
   * Simulate data sync operation
   */
  private async syncData(): Promise<void> {
    const startTime = Date.now();

    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

      if (this.pendingChanges.length > 0) {
        const changesToSync = this.pendingChanges.splice(0, 20); // Batch changes
        
        // Simulate broadcasting changes from server
        for (const change of changesToSync) {
          this.broadcastChange(change);
        }
      }

      // Update sync status
      this.isConnected = true;
      this.lastSync = Date.now();
      this.failedAttempts = 0;

      // Track latency
      const latency = Date.now() - startTime;
      this.latencies.push(latency);
      if (this.latencies.length > 100) {
        this.latencies.shift();
      }
    } catch (error) {
      this.failedAttempts++;
      if (this.failedAttempts > 5) {
        this.isConnected = false;
      }
    }
  }

  /**
   * Manually trigger a data change
   */
  public recordChange(
    entityType: string,
    changeType: DataChangeType,
    entityId: string,
    newData: Record<string, any>,
    previousData?: Record<string, any>,
    changedBy: string = 'system'
  ): DataChange {
    const change: DataChange = {
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      entityType,
      changeType,
      entityId,
      newData,
      previousData,
      changedBy,
      changedFields: previousData
        ? Object.keys(newData).filter((k) => newData[k] !== previousData[k])
        : undefined,
    };

    this.broadcastChange(change);
    return change;
  }

  /**
   * Get current sync status
   */
  public getStatus(): SyncStatus {
    const avgLatency =
      this.latencies.length > 0
        ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
        : 0;

    return {
      isConnected: this.isConnected,
      lastSync: this.lastSync,
      pendingChanges: this.pendingChanges.length,
      failedAttempts: this.failedAttempts,
      averageLatency: Math.round(avgLatency),
    };
  }

  /**
   * Get change history
   */
  public getChangeHistory(
    entityType?: string,
    limit: number = 50
  ): DataChange[] {
    let history = this.changeHistory;

    if (entityType) {
      history = history.filter((c) => c.entityType === entityType);
    }

    return history.slice(-limit).reverse();
  }

  /**
   * Clear history
   */
  public clearHistory(): void {
    this.changeHistory = [];
    this.pendingChanges = [];
  }

  /**
   * Reset sync status
   */
  public reset(): void {
    this.clearHistory();
    this.isConnected = true;
    this.lastSync = Date.now();
    this.failedAttempts = 0;
    this.latencies = [];
  }
}

// Export singleton instance
export const realtimeSyncManager = new RealtimeSyncManager();
