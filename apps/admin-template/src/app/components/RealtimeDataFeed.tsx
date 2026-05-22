import React from 'react';
import { Card, Badge } from '@react-mono/ui-controls';
import { DataChange, DataChangeType } from '../types/realtimeSync';

interface RealtimeDataFeedProps {
  changes: DataChange[];
  isDarkMode?: boolean;
  maxItems?: number;
}

const changeTypeColors = {
  [DataChangeType.CREATE]: 'success',
  [DataChangeType.UPDATE]: 'warning',
  [DataChangeType.DELETE]: 'danger',
  [DataChangeType.BULK_UPDATE]: 'warning',
  [DataChangeType.SYNC]: 'secondary',
} as const;

const changeTypeIcons = {
  [DataChangeType.CREATE]: '➕',
  [DataChangeType.UPDATE]: '✏️',
  [DataChangeType.DELETE]: '🗑️',
  [DataChangeType.BULK_UPDATE]: '📦',
  [DataChangeType.SYNC]: '🔄',
} as const;

export const RealtimeDataFeed: React.FC<RealtimeDataFeedProps> = ({
  changes,
  isDarkMode = false,
  maxItems = 20,
}) => {
  const displayChanges = changes.slice(0, maxItems);

  if (displayChanges.length === 0) {
    return (
      <Card>
        <div className={`p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No real-time updates yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-2 p-4 max-h-96 overflow-y-auto">
        {displayChanges.map((change) => (
          <div
            key={change.id}
            className={`rounded-lg border p-3 ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            } transition-colors`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">
                {changeTypeIcons[change.changeType]}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {change.entityType}
                  </span>
                  <Badge variant={changeTypeColors[change.changeType]} className="text-xs">
                    {change.changeType}
                  </Badge>
                  {change.changedFields && change.changedFields.length > 0 && (
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {change.changedFields.length} field{change.changedFields.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className={`mt-1 text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>
                    <strong>ID:</strong> {change.entityId}
                  </div>
                  {change.changedFields && change.changedFields.length > 0 && (
                    <div>
                      <strong>Changed:</strong> {change.changedFields.join(', ')}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>By:</strong> {change.changedBy}
                    </span>
                    <span>
                      {new Date(change.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
