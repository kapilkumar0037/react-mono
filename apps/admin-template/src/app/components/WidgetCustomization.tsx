import React, { useMemo, useState } from 'react';
import { Modal, Button, Card } from '@react-mono/ui-controls';
import { DashboardLayout, WidgetInstance } from '../types/dashboard';
import { getAvailableWidgets } from '../utils/dashboardStorage';

interface WidgetCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: DashboardLayout | null;
  onAddWidget: (widget: WidgetInstance) => void;
  onRemoveWidget: (widgetId: string) => void;
  isDarkMode?: boolean;
}

export const WidgetCustomization: React.FC<WidgetCustomizationProps> = ({
  isOpen,
  onClose,
  currentLayout,
  onAddWidget,
  onRemoveWidget,
  isDarkMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('metrics');
  const allWidgets = getAvailableWidgets();
  const activeWidgetIds = currentLayout?.widgets.map((w) => w.id) || [];

  const categorizedWidgets = useMemo(() => {
    return allWidgets.reduce(
      (acc, widget) => {
        if (!acc[widget.category]) {
          acc[widget.category] = [];
        }
        acc[widget.category].push(widget);
        return acc;
      },
      {} as Record<string, typeof allWidgets>
    );
  }, []);

  const categories = Object.keys(categorizedWidgets);
  const widgetsInCategory = categorizedWidgets[selectedCategory] || [];

  const handleAddWidget = (widgetMetadata: any) => {
    const newWidget: WidgetInstance = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: widgetMetadata.type,
      title: widgetMetadata.title,
      position: currentLayout?.widgets.length || 0,
      width: widgetMetadata.defaultWidth,
      height: widgetMetadata.defaultHeight,
      isVisible: true,
      lastUpdated: Date.now(),
    };
    onAddWidget(newWidget);
  };

  const handleRemoveWidget = (id: string) => {
    onRemoveWidget(id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Customization" size="lg">
      <div className={`space-y-4 max-h-96 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedCategory === category
                  ? `border-blue-600 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                  : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Available Widgets */}
        <div className="space-y-2">
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Available Widgets
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {widgetsInCategory.map((widget) => (
              <div
                key={widget.id}
                className={`rounded-lg p-3 flex items-center justify-between ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{widget.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {widget.title}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {widget.description}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddWidget(widget)}
                  className="bg-blue-600 text-white px-3 py-1 text-xs"
                >
                  + Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Widgets */}
        {currentLayout && currentLayout.widgets.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Active Widgets ({currentLayout.widgets.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentLayout.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`rounded-lg p-3 flex items-center justify-between ${
                    isDarkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {widget.title}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {widget.width}x{widget.height} grid
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="bg-red-600 text-white px-3 py-1 text-xs"
                  >
                    ✕ Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <Button onClick={onClose} className="bg-gray-500 text-white">
          Done
        </Button>
      </div>
    </Modal>
  );
};
