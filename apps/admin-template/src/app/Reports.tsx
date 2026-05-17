import React, { useEffect, useState } from 'react';
import { Card, Badge } from '@react-mono/ui-controls';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Scatter, ScatterChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { usePageAction } from './usePageAction';
import { createSavedView, persistSavedViews, readSavedViews, SavedView } from './savedViews';
import { useGlobalToast } from './hooks/useGlobalToast';

interface ReportsProps {
  isDarkMode?: boolean;
}

interface ReportViewFilters {
  tab: string;
  start: string;
  end: string;
}

const Reports: React.FC<ReportsProps> = ({ isDarkMode = false }) => {
  const { addToast } = useGlobalToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') ?? 'sales');
  const [dateRange, setDateRange] = useState({
    start: searchParams.get('start') ?? '2024-01-01',
    end: searchParams.get('end') ?? '2024-12-31',
  });
  const [savedViews, setSavedViews] = useState<SavedView<ReportViewFilters>[]>(() => readSavedViews<ReportViewFilters>('reports'));
  const [viewName, setViewName] = useState('');

  // Mock data for different reports
  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 320, avgOrderValue: 140.6 },
    { month: 'Feb', revenue: 52000, orders: 380, avgOrderValue: 136.8 },
    { month: 'Mar', revenue: 48000, orders: 355, avgOrderValue: 135.2 },
    { month: 'Apr', revenue: 61000, orders: 440, avgOrderValue: 138.6 },
    { month: 'May', revenue: 55000, orders: 410, avgOrderValue: 134.1 },
    { month: 'Jun', revenue: 67000, orders: 480, avgOrderValue: 139.6 },
    { month: 'Jul', revenue: 72000, orders: 520, avgOrderValue: 138.5 },
    { month: 'Aug', revenue: 68000, orders: 490, avgOrderValue: 138.8 },
    { month: 'Sep', revenue: 74000, orders: 530, avgOrderValue: 139.6 },
    { month: 'Oct', revenue: 79000, orders: 560, avgOrderValue: 141.1 },
    { month: 'Nov', revenue: 85000, orders: 600, avgOrderValue: 141.7 },
    { month: 'Dec', revenue: 92000, orders: 650, avgOrderValue: 141.5 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, revenue: 245000 },
    { name: 'Clothing', value: 28, revenue: 196000 },
    { name: 'Home & Garden', value: 18, revenue: 126000 },
    { name: 'Books', value: 12, revenue: 84000 },
    { name: 'Other', value: 7, revenue: 49000 },
  ];

  const userMetricsData = [
    { week: 'Week 1', newUsers: 120, activeUsers: 850, churnRate: 3.2 },
    { week: 'Week 2', newUsers: 145, activeUsers: 920, churnRate: 2.8 },
    { week: 'Week 3', newUsers: 110, activeUsers: 880, churnRate: 3.5 },
    { week: 'Week 4', newUsers: 165, activeUsers: 1020, churnRate: 2.1 },
    { week: 'Week 5', newUsers: 130, activeUsers: 950, churnRate: 2.9 },
    { week: 'Week 6', newUsers: 155, activeUsers: 1050, churnRate: 2.3 },
  ];

  const topProducts = [
    { id: 1, name: 'Wireless Earbuds', sales: 2450, revenue: 147000, trend: 'up' },
    { id: 2, name: 'Smart Watch', sales: 1820, revenue: 182000, trend: 'up' },
    { id: 3, name: 'Phone Case Set', sales: 3200, revenue: 64000, trend: 'down' },
    { id: 4, name: 'USB-C Cable', sales: 5100, revenue: 25500, trend: 'down' },
    { id: 5, name: 'Laptop Stand', sales: 1560, revenue: 46800, trend: 'up' },
  ];

  // Data for AreaChart
  const areaChartData = [
    { month: 'Jan', online: 4000, offline: 2400, partners: 2400 },
    { month: 'Feb', online: 3000, offline: 1398, partners: 2210 },
    { month: 'Mar', online: 2000, offline: 9800, partners: 2290 },
    { month: 'Apr', online: 2780, offline: 3908, partners: 2000 },
    { month: 'May', online: 1890, offline: 4800, partners: 2181 },
    { month: 'Jun', online: 2390, offline: 3800, partners: 2500 },
  ];

  // Data for ComposedChart
  const composedData = [
    { month: 'Jan', sales: 59, profit: 40, cost: 19 },
    { month: 'Feb', sales: 70, profit: 48, cost: 22 },
    { month: 'Mar', sales: 78, profit: 55, cost: 23 },
    { month: 'Apr', sales: 85, profit: 62, cost: 23 },
    { month: 'May', sales: 92, profit: 70, cost: 22 },
    { month: 'Jun', sales: 98, profit: 78, cost: 20 },
  ];

  // Data for RadarChart
  const radarData = [
    { category: 'Pricing', value: 85 },
    { category: 'Quality', value: 92 },
    { category: 'Delivery', value: 78 },
    { category: 'Support', value: 88 },
    { category: 'Reliability', value: 81 },
    { category: 'Satisfaction', value: 90 },
  ];

  // Data for ScatterChart
  const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 250, z: 220 },
    { x: 170, y: 300, z: 250 },
    { x: 140, y: 280, z: 200 },
    { x: 150, y: 250, z: 250 },
    { x: 110, y: 200, z: 150 },
    { x: 130, y: 230, z: 200 },
    { x: 90, y: 240, z: 180 },
    { x: 160, y: 290, z: 230 },
    { x: 180, y: 320, z: 270 },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const exportReport = (format: string) => {
    const reportName = `${activeTab}-report-${new Date().toISOString().split('T')[0]}`;
    addToast({
      message: `Exporting ${reportName} as ${format.toUpperCase()}.`,
      type: 'info',
    });
  };

  const generateReport = () => {
    addToast({
      message: `Generated ${activeTab} report for ${dateRange.start} to ${dateRange.end}.`,
      type: 'success',
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabId);
    setSearchParams(nextParams, { replace: true });
  };

  usePageAction('generate-report', generateReport);
  usePageAction('export-csv', () => exportReport('csv'));

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    const requestedStart = searchParams.get('start');
    const requestedEnd = searchParams.get('end');

    if (requestedTab && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
    }

    if (
      requestedStart &&
      requestedEnd &&
      (requestedStart !== dateRange.start || requestedEnd !== dateRange.end)
    ) {
      setDateRange({ start: requestedStart, end: requestedEnd });
    }
  }, [activeTab, dateRange.end, dateRange.start, searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', activeTab);
    nextParams.set('start', dateRange.start);
    nextParams.set('end', dateRange.end);
    setSearchParams(nextParams, { replace: true });
  }, [activeTab, dateRange.end, dateRange.start, searchParams, setSearchParams]);

  const getCurrentFilters = (): ReportViewFilters => ({
    tab: activeTab,
    start: dateRange.start,
    end: dateRange.end,
  });

  const applySavedView = (filters: ReportViewFilters) => {
    setActiveTab(filters.tab);
    setDateRange({ start: filters.start, end: filters.end });
  };

  const handleSaveView = () => {
    if (!viewName.trim()) {
      addToast({
        message: 'Name the report view before saving it.',
        type: 'warning',
      });
      return;
    }

    const nextViews = [...savedViews, createSavedView(viewName.trim(), getCurrentFilters())];
    setSavedViews(nextViews);
    persistSavedViews('reports', nextViews);
    setViewName('');
    addToast({
      message: 'Saved report view ready to share.',
      type: 'success',
    });
  };

  const handleDeleteView = (viewId: string) => {
    const nextViews = savedViews.filter((view) => view.id !== viewId);
    setSavedViews(nextViews);
    persistSavedViews('reports', nextViews);
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reports & Analytics
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate and track business metrics across different categories
          </p>
        </div>

        {/* Date Range & Export */}
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="mb-3 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Saved Report Views</p>
              <p className="text-xs text-gray-600 mt-0.5">Capture the current tab and date window as a reusable report view.</p>
            </div>
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
              <input
                type="text"
                value={viewName}
                onChange={(event) => setViewName(event.target.value)}
                placeholder="Name this report view"
                className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleSaveView} className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                Save View
              </button>
            </div>
          </div>

          {savedViews.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {savedViews.map((view) => (
                <div key={view.id} className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1">
                  <button type="button" onClick={() => applySavedView(view.filters)} className="text-sm font-medium text-gray-700">
                    {view.name}
                  </button>
                  <button type="button" onClick={() => handleDeleteView(view.id)} className="px-1 text-xs text-gray-500" aria-label={`Delete ${view.name}`}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => exportReport('csv')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Export CSV
              </button>
              <button onClick={() => exportReport('pdf')} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Export PDF
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'sales', label: 'Sales Report' },
              { id: 'users', label: 'User Analytics' },
              { id: 'products', label: 'Product Performance' },
              { id: 'trends', label: 'Trend Analysis' },
              { id: 'comparison', label: 'Comparison' },
              { id: 'performance', label: 'Performance' },
              { id: 'correlation', label: 'Correlation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sales Report Tab */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: '$799,000', change: '+12.5%', trend: 'up' },
                { label: 'Total Orders', value: '5,935', change: '+8.2%', trend: 'up' },
                { label: 'Avg Order Value', value: '$134.77', change: '+2.1%', trend: 'up' },
                { label: 'Conversion Rate', value: '3.24%', change: '-0.8%', trend: 'down' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <Card title="Revenue & Orders Trend" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
                  <Bar dataKey="orders" fill="#10B981" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Sales by Category" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {colors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        color: isDarkMode ? '#ffffff' : '#000000',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue by Category" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
                <div className="space-y-3">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[idx] }}
                        ></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {cat.name}
                        </span>
                      </div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${(cat.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Users', value: '12,450', change: '+5.2%', trend: 'up' },
                { label: 'Active Users (30d)', value: '8,320', change: '+3.1%', trend: 'up' },
                { label: 'Avg Churn Rate', value: '2.8%', change: '-0.5%', trend: 'up' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* User Growth Chart */}
            <Card title="User Growth & Activity" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="newUsers" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Churn Analysis */}
            <Card title="Churn Rate Analysis" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userMetricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Bar dataKey="churnRate" fill="#EF4444" name="Churn Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Product Performance Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Product KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Products', value: '1,248', change: '+8.5%', trend: 'up' },
                { label: 'Avg Rating', value: '4.6/5.0', change: '+0.3', trend: 'up' },
                { label: 'Out of Stock', value: '32 items', change: '+15', trend: 'down' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Top Products Table */}
            <Card title="Top Performing Products" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`px-4 py-3 text-left font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Product Name
                      </th>
                      <th className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Sales
                      </th>
                      <th className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Revenue
                      </th>
                      <th className={`px-4 py-3 text-center font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                      >
                        <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {product.name}
                        </td>
                        <td className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {product.sales.toLocaleString()}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${(product.revenue / 1000).toFixed(0)}K
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-medium ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {product.trend === 'up' ? '↑' : '↓'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Trend Analysis Tab - Area Chart */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Trend Direction', value: 'Upward', change: '+2.4%', trend: 'up' },
                { label: 'Growth Rate', value: '14.2%', change: '+0.8%', trend: 'up' },
                { label: 'Market Share', value: '18.5%', change: '+1.2%', trend: 'up' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Sales Channel Trends (Area Chart)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={areaChartData}>
                  <defs>
                    <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPartners" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="online" stroke="#3B82F6" fillOpacity={1} fill="url(#colorOnline)" name="Online Sales" />
                  <Area type="monotone" dataKey="offline" stroke="#10B981" fillOpacity={1} fill="url(#colorOffline)" name="Offline Sales" />
                  <Area type="monotone" dataKey="partners" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPartners)" name="Partner Sales" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Comparison Tab - Composed Chart */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Avg Sales', value: '85.2', change: '+5%', trend: 'up' },
                { label: 'Avg Profit', value: '62.1', change: '+8%', trend: 'up' },
                { label: 'Profit Margin', value: '72.9%', change: '+2.1%', trend: 'up' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Sales vs Profit vs Cost (Composed Chart)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={composedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
                  <Bar dataKey="cost" fill="#EF4444" name="Cost" />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Performance Tab - Radar Chart */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Overall Score', value: '85.8', change: '+3.2%', trend: 'up' },
                { label: 'Quality Index', value: '92', change: '+1.5%', trend: 'up' },
                { label: 'Support Rating', value: '88', change: '+2%', trend: 'up' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Business Performance Metrics (Radar Chart)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <PolarAngleAxis dataKey="category" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <PolarRadiusAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Radar name="Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Correlation Tab - Scatter Chart */}
        {activeTab === 'correlation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Data Points', value: '1,245', change: '+12.5%', trend: 'up' },
                { label: 'Correlation Strength', value: '0.82', change: '+0.05', trend: 'up' },
                { label: 'Confidence Level', value: '94.3%', change: '+2.1%', trend: 'up' },
              ].map((kpi, idx) => (
                <Card
                  key={idx}
                  title={kpi.label}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
                >
                  <div>
                    <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpi.value}
                    </p>
                    <Badge variant={kpi.trend === 'up' ? 'success' : 'danger'}>
                      {kpi.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Variable Correlation Analysis (Scatter Chart)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis type="number" dataKey="x" name="Feature X" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis type="number" dataKey="y" name="Feature Y" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Data Correlation" data={scatterData} fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
