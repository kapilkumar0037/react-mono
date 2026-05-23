import React from 'react';
import { SyncStatus } from '../types/realtimeSync';

interface RealtimeStatusIndicatorProps {
  syncStatus: SyncStatus;
  isDarkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RealtimeStatusIndicator: React.FC<RealtimeStatusIndicatorProps> = ({
  syncStatus,
  isDarkMode = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const statusColor = syncStatus.isConnected
    ? 'bg-green-500'
    : 'bg-red-500';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
      }`}
    >
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`${sizeClasses[size]} rounded-full ${statusColor} animate-pulse`}
          title={syncStatus.isConnected ? 'Connected' : 'Disconnected'}
        />
        <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {syncStatus.isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {/* Separator */}
      <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

      {/* Latency */}
      <div className="flex items-center gap-1">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {syncStatus.averageLatency}ms
        </span>
      </div>

      {/* Pending Changes */}
      {syncStatus.pendingChanges > 0 && (
        <>
          <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
              {syncStatus.pendingChanges}
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              pending
            </span>
          </div>
        </>
      )}

      {/* Last Sync */}
      <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
      <div className="flex items-center gap-1">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Last: {formatTimeAgo(syncStatus.lastSync)}
        </span>
      </div>
    </div>
  );
};

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else {
    return 'a while ago';
  }
};
