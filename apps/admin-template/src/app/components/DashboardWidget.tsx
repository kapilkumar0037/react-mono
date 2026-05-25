import React from 'react';
import { Card } from '@react-mono/ui-controls';
import { WidgetInstance } from '../types/dashboard';

interface DashboardWidgetProps {
  widget: WidgetInstance;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<WidgetInstance>) => void;
  onDragStart?: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  isDarkMode = false,
  isEditing = false,
  onDelete,
  onUpdate,
  onDragStart,
  children,
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      draggable={isEditing}
      onDragStart={onDragStart}
    >
      {/* Widget Header */}
      <div
        className={`border-b px-4 py-3 flex items-center justify-between ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <h3
          className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
        >
          {widget.title}
        </h3>

        {isEditing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={widget.title}
              onChange={(e) => onUpdate?.({ title: e.target.value })}
              className={`text-xs px-2 py-1 rounded border ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="Widget title"
            />

            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Widget Content */}
      <div
        className={`p-4 min-h-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        {children}
      </div>

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
          ✎ Edit
        </div>
      )}
    </Card>
  );
};
