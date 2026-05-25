import React from 'react';
import { DashboardWidget } from './DashboardWidget';
import { WidgetInstance } from '../types/dashboard';

interface MetricWidgetProps {
  widget: WidgetInstance;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<WidgetInstance>) => void;
  onDragStart?: (e: React.DragEvent) => void;
  metric: {
    label: string;
    value: string | number;
    change?: number;
    icon?: string;
    color?: string;
  };
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  widget,
  isDarkMode = false,
  isEditing = false,
  onDelete,
  onUpdate,
  onDragStart,
  metric,
}) => {
  const changeColor =
    metric.change !== undefined
      ? metric.change >= 0
        ? isDarkMode
          ? 'text-green-400'
          : 'text-green-600'
        : isDarkMode
          ? 'text-red-400'
          : 'text-red-600'
      : '';

  return (
    <DashboardWidget
      widget={widget}
      isDarkMode={isDarkMode}
      isEditing={isEditing}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onDragStart={onDragStart}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {metric.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p
              className={`text-3xl font-bold ${metric.color || (isDarkMode ? 'text-white' : 'text-gray-900')}`}
            >
              {metric.value}
            </p>
            {metric.change !== undefined && (
              <p className={`text-xs font-semibold ${changeColor}`}>
                {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </p>
            )}
          </div>
        </div>
        {metric.icon && <div className="text-4xl">{metric.icon}</div>}
      </div>
    </DashboardWidget>
  );
};

interface ChartWidgetProps {
  widget: WidgetInstance;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<WidgetInstance>) => void;
  onDragStart?: (e: React.DragEvent) => void;
  chart: React.ReactNode;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  widget,
  isDarkMode = false,
  isEditing = false,
  onDelete,
  onUpdate,
  onDragStart,
  chart,
}) => {
  return (
    <DashboardWidget
      widget={widget}
      isDarkMode={isDarkMode}
      isEditing={isEditing}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onDragStart={onDragStart}
    >
      <div className="w-full h-64 flex items-center justify-center">{chart}</div>
    </DashboardWidget>
  );
};

interface StatusWidget {
  label: string;
  value: number;
  color: string;
  icon: string;
}

interface StatusOverviewWidgetProps {
  widget: WidgetInstance;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<WidgetInstance>) => void;
  onDragStart?: (e: React.DragEvent) => void;
  statuses: StatusWidget[];
}

export const StatusOverviewWidget: React.FC<StatusOverviewWidgetProps> = ({
  widget,
  isDarkMode = false,
  isEditing = false,
  onDelete,
  onUpdate,
  onDragStart,
  statuses,
}) => {
  const total = statuses.reduce((sum, s) => sum + s.value, 0);

  return (
    <DashboardWidget
      widget={widget}
      isDarkMode={isDarkMode}
      isEditing={isEditing}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onDragStart={onDragStart}
    >
      <div className="space-y-3">
        {statuses.map((status, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{status.icon}</span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-2 flex-1 rounded-full ${status.color}`} style={{ width: '80px' }} />
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {status.value} ({Math.round((status.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user?: string;
  icon?: string;
}

interface ActivityFeedWidgetProps {
  widget: WidgetInstance;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<WidgetInstance>) => void;
  onDragStart?: (e: React.DragEvent) => void;
  activities: ActivityItem[];
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
  widget,
  isDarkMode = false,
  isEditing = false,
  onDelete,
  onUpdate,
  onDragStart,
  activities,
}) => {
  return (
    <DashboardWidget
      widget={widget}
      isDarkMode={isDarkMode}
      isEditing={isEditing}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onDragStart={onDragStart}
    >
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex gap-3 pb-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            {activity.icon && <span className="text-lg flex-shrink-0">{activity.icon}</span>}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activity.action}
              </p>
              {activity.user && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  by {activity.user}
                </p>
              )}
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};
