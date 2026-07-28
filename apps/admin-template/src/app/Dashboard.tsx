import React, { useState } from 'react';
import { Button } from '@react-mono/ui-controls';
import { useDashboard } from './hooks/useDashboard';
import { WidgetCustomization } from './components/WidgetCustomization';
import { LayoutManager } from './components/LayoutManager';
import { MetricWidget, ChartWidget, StatusOverviewWidget, ActivityFeedWidget } from './components/WidgetComponents';
import { WidgetInstance, WidgetType } from './types/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode = false }) => {
  const {
    layouts,
    preferences,
    getActiveLayout,
    switchLayout,
    createNewLayout,
    deleteCurrentLayout,
    addWidget,
    removeWidget,
    updateWidget,
    reorderLayoutWidgets,
    toggleEditMode,
  } = useDashboard();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isManagingLayouts, setIsManagingLayouts] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const activeLayout = getActiveLayout();
  const visibleWidgets = activeLayout?.widgets.filter((widget) => widget.isVisible) || [];
  const hiddenWidgetCount = activeLayout?.widgets.filter((widget) => !widget.isVisible).length || 0;

  // Sample data
  const salesData = [
    { month: 'Jan', revenue: 40000, expenses: 24000 },
    { month: 'Feb', revenue: 30000, expenses: 13980 },
    { month: 'Mar', revenue: 20000, expenses: 9800 },
    { month: 'Apr', revenue: 27800, expenses: 39080 },
    { month: 'May', revenue: 18900, expenses: 48000 },
    { month: 'Jun', revenue: 23900, expenses: 38000 },
  ];

  const userMetric = { label: 'Total Users', value: '1,245', change: 12, icon: '👥', color: 'text-blue-600' };
  const ordersMetric = { label: 'Total Orders', value: '8,920', change: 8, icon: '📦', color: 'text-green-600' };
  const revenueMetric = { label: 'Revenue', value: '$89,230', change: 15, icon: '💰', color: 'text-orange-600' };
  const sessionsMetric = { label: 'Active Sessions', value: '342', change: -3, icon: '🟢', color: 'text-green-600' };

  const orderStatuses = [
    { label: 'Completed', value: 320, color: 'bg-green-500', icon: '✓' },
    { label: 'In Progress', value: 145, color: 'bg-blue-500', icon: '⟳' },
    { label: 'Pending', value: 78, color: 'bg-yellow-500', icon: '⏳' },
    { label: 'Failed', value: 12, color: 'bg-red-500', icon: '✕' },
  ];

  const recentActivities = [
    { id: '1', action: 'New user registration', timestamp: '2 mins ago', user: 'System', icon: '📝' },
    { id: '2', action: 'Order #12345 completed', timestamp: '15 mins ago', user: 'Order Service', icon: '📦' },
    { id: '3', action: 'Revenue report generated', timestamp: '1 hour ago', user: 'Reporting', icon: '📊' },
    { id: '4', action: 'System backup completed', timestamp: '2 hours ago', user: 'System', icon: '💾' },
  ];

  const handleWidgetDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetWidgetId || !activeLayout) return;

    const currentIds = activeLayout.widgets.sort((a, b) => a.position - b.position).map((w) => w.id);
    const draggedIndex = currentIds.indexOf(draggedWidget);
    const targetIndex = currentIds.indexOf(targetWidgetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const reordered = [...currentIds];
    reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedWidget);

    reorderLayoutWidgets(activeLayout.id, reordered);
    setDraggedWidget(null);
  };

  const renderWidget = (widget: WidgetInstance) => {
    switch (widget.type) {
      case WidgetType.METRIC_CARD:
        let metric = userMetric;
        if (widget.title.includes('Orders')) metric = ordersMetric;
        else if (widget.title.includes('Revenue')) metric = revenueMetric;
        else if (widget.title.includes('Active')) metric = sessionsMetric;

        return (
          <MetricWidget
            key={widget.id}
            widget={widget}
            isDarkMode={isDarkMode}
            isEditing={activeLayout?.isEditing}
            onDelete={() => removeWidget(activeLayout?.id || '', widget.id)}
            onUpdate={(updates) => updateWidget(activeLayout?.id || '', widget.id, updates)}
            onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
            metric={metric}
          />
        );

      case WidgetType.CHART:
        return (
          <ChartWidget
            key={widget.id}
            widget={widget}
            isDarkMode={isDarkMode}
            isEditing={activeLayout?.isEditing}
            onDelete={() => removeWidget(activeLayout?.id || '', widget.id)}
            onUpdate={(updates) => updateWidget(activeLayout?.id || '', widget.id, updates)}
            onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
            chart={
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#f3f4f6' : '#111827',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            }
          />
        );

      case WidgetType.STATUS_OVERVIEW:
        return (
          <StatusOverviewWidget
            key={widget.id}
            widget={widget}
            isDarkMode={isDarkMode}
            isEditing={activeLayout?.isEditing}
            onDelete={() => removeWidget(activeLayout?.id || '', widget.id)}
            onUpdate={(updates) => updateWidget(activeLayout?.id || '', widget.id, updates)}
            onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
            statuses={orderStatuses}
          />
        );

      case WidgetType.ACTIVITY_FEED:
        return (
          <ActivityFeedWidget
            key={widget.id}
            widget={widget}
            isDarkMode={isDarkMode}
            isEditing={activeLayout?.isEditing}
            onDelete={() => removeWidget(activeLayout?.id || '', widget.id)}
            onUpdate={(updates) => updateWidget(activeLayout?.id || '', widget.id, updates)}
            onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
            activities={recentActivities}
          />
        );

      default:
        return null;
    }
  };

  if (!activeLayout) {
    return <div className="p-8 text-center">No dashboard layout found</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeLayout.name}
                {activeLayout.isEditing && <span className="ml-2 text-blue-500">(Editing)</span>}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsManagingLayouts(true)}
                className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                📑 Layouts
              </Button>

              <Button
                onClick={() => setIsCustomizing(true)}
                className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                ⚙ Customize
              </Button>

              <Button
                onClick={() => {
                  toggleEditMode(activeLayout.id);
                }}
                className={`${
                  activeLayout.isEditing
                    ? 'bg-green-600 text-white'
                    : isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeLayout.isEditing ? '✓ Done Editing' : '✎ Edit Layout'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeLayout.widgets.length === 0 ? (
          <div className={`rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              No widgets in this layout
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Customize" to add widgets to your dashboard
            </p>
            <Button
              onClick={() => setIsCustomizing(true)}
              className="mt-4 bg-blue-600 text-white"
            >
              Add Widgets
            </Button>
          </div>
        ) : visibleWidgets.length === 0 ? (
          <div className={`rounded-lg p-12 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Widgets are hidden
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {hiddenWidgetCount} widget{hiddenWidgetCount !== 1 ? 's are' : ' is'} currently hidden.
            </p>
            <Button
              onClick={() => setIsCustomizing(true)}
              className="mt-4 bg-blue-600 text-white"
            >
              Manage Widgets
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-4`}
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${300}px, 1fr))`,
              gridAutoRows: 'auto',
            }}
            onDragOver={handleDragOver}
          >
            {visibleWidgets
              .sort((a, b) => a.position - b.position)
              .map((widget) => (
                <div
                  key={widget.id}
                  style={{ gridColumn: `span ${Math.min(widget.width, 3)}` }}
                  draggable={activeLayout.isEditing}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, widget.id)}
                >
                  {renderWidget(widget)}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <WidgetCustomization
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
        currentLayout={activeLayout}
        onAddWidget={(widget) => addWidget(activeLayout.id, widget)}
        onRemoveWidget={(widgetId) => removeWidget(activeLayout.id, widgetId)}
        onUpdateWidget={(widgetId, updates) => updateWidget(activeLayout.id, widgetId, updates)}
        isDarkMode={isDarkMode}
      />

      <LayoutManager
        isOpen={isManagingLayouts}
        onClose={() => setIsManagingLayouts(false)}
        layouts={layouts}
        activeLayoutId={preferences.activeLayoutId}
        onSwitchLayout={switchLayout}
        onCreateLayout={createNewLayout}
        onDeleteLayout={deleteCurrentLayout}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Dashboard;
