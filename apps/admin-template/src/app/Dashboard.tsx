import React, { useEffect, useState } from 'react';
import { Button, Card } from '@react-mono/ui-controls';
import { useDashboard } from './hooks/useDashboard';
import { WidgetCustomization } from './components/WidgetCustomization';
import { LayoutManager } from './components/LayoutManager';
import { MetricWidget, ChartWidget, StatusOverviewWidget, ActivityFeedWidget } from './components/WidgetComponents';
import { WidgetInstance, WidgetType } from './types/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
    updateCurrentLayout,
    deleteCurrentLayout,
    addWidget,
    removeWidget,
    updateWidget,
    updatePreferences,
    toggleEditMode,
  } = useDashboard();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isManagingLayouts, setIsManagingLayouts] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const activeLayout = getActiveLayout();

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
        ) : (
          <div
            className={`grid gap-4`}
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${300}px, 1fr))`,
              gridAutoRows: 'auto',
            }}
            onDragOver={handleDragOver}
          >
            {activeLayout.widgets
              .sort((a, b) => a.position - b.position)
              .map((widget) => (
                <div key={widget.id} style={{ gridColumn: `span ${Math.min(widget.width, 3)}` }}>
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
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                A
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back, {userProfile.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You have <span className="font-semibold">21 Pending Approvals</span> & <span className="font-semibold">12 Leave Requests</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm font-semibold">+ Add Schedule</button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-semibold">+ Add Requestees</button>
            </div>
          </div>

          {/* Primary Metrics Cards - 4 Column */}
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className={`rounded-lg border-l-4 p-2.5 bg-white dark:bg-gray-800 shadow ${metric.color}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-3">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Secondary Metrics - 4 Column */}
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            <div className="rounded-lg p-2.5 bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500 shadow">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Pending</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">$21,645</p>
              <a href="#" className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-3 block">View Transactions →</a>
            </div>
            <div className="rounded-lg p-2.5 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 shadow">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">This Week</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">$5,644</p>
              <a href="#" className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-3 block">View Earnings →</a>
            </div>
            <div className="rounded-lg p-2.5 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 shadow">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">New Applicants</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">98</p>
              <a href="#" className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-3 block">View All →</a>
            </div>
            <div className="rounded-lg p-2.5 bg-gray-800 dark:bg-gray-700 border-l-4 border-gray-600 shadow">
              <p className="text-sm font-semibold text-white mt-2">New Tasks This month</p>
              <p className="text-3xl font-bold text-white mt-2">45/98</p>
              <a href="#" className="text-xs text-orange-400 font-semibold mt-3 block">View Candidates →</a>
            </div>
          </div>

          {/* Top Section - Charts */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Employee Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3.5 border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Employee Status</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">This Week</span>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">154</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Employee</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Fulltime (54%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Contrast (29%)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">112</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Present (22%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">21</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Absent (17%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Permission</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">04</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave</p>
                </div>
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3.5 border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Attendance Overview</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={employeeStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {employeeStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-2xl font-bold text-gray-900 dark:text-white mt-2">120</p>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">Total Attendance</p>
              <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                </div>
              </div>
            </div>

            {/* Clock-In/Out */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3.5 border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Clock-In/Out</h3>
                <div className="flex gap-2">
                  <select className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Departments</option>
                  </select>
                  <select className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Today</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {clockInOutData.map((emp, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{emp.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{emp.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${emp.status.includes('IN') ? 'text-green-600' : 'text-red-600'}`}>{emp.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs Applicants & Employees */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Jobs Applicants */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3.5 border-t-4 border-blue-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Jobs Applicants</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400">View All</a>
              </div>
              <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                <button className="px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white">Openings</button>
                <button className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Applicants</button>
              </div>
              <div className="space-y-3">
                {jobApplicants.map((applicant, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {applicant.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{applicant.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{applicant.position}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded font-medium ${applicant.color}`}>
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employees Table */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-3.5 border-t-4 border-blue-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Employees</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">{emp.name}</td>
                        <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{emp.dept}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Todo, Sales Overview & Invoices */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Sales Overview */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-green-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
                <div className="flex gap-2">
                  <select className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Departments</option>
                  </select>
                  <select className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>September</option>
                  </select>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Bar dataKey="Income" fill="#f97316" />
                  <Bar dataKey="Expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <p>Last Updated at 11:30 PM</p>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-pink-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Invoices</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">All Invoices</a>
              </div>
              <div className="space-y-3">
                {invoices.map((invoice, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        🎯
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.status}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-semibold ${invoice.color}`}>{invoice.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects & Tasks Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Projects */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-cyan-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Projects</h3>
                <select className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>September</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Hours</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Deadline</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{project.id}</td>
                        <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{project.name}</td>
                        <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{project.team}</td>
                        <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{project.hours}</td>
                        <td className="py-2 px-2 text-gray-600 dark:text-gray-400">{project.deadline}</td>
                        <td className="py-2 px-2"><span className={`text-xs font-semibold ${project.color}`}>•</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tasks Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-blue-500">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Tasks Statistics</h3>
              <div className="text-center mb-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">124/165</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Spent on Overall Tasks This Week</p>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={tasksStats} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value">
                    {tasksStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {tasksStats.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{task.name} {task.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Schedules, Activities, Birthdays */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Schedules */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-teal-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Schedules</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View All</a>
              </div>
              <div className="space-y-3">
                {schedules.map((schedule, idx) => (
                  <div key={idx} className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded border-l-4 border-teal-500">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold bg-teal-600 text-white w-fit px-2 py-1 rounded mb-1">Slot Booking</p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{schedule.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{schedule.date}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{schedule.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-purple-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View All</a>
              </div>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{activity.user}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Birthdays */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border-t-4 border-pink-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Birthdays</h3>
                <a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View All</a>
              </div>
              <div className="space-y-3">
                {birthdays.map((birthday, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{birthday.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{birthday.date}</p>
                    </div>
                    <button className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium">
                      🎂 {birthday.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
