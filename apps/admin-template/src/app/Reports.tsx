import React, { useState } from 'react';
import { Card, Badge } from '@react-mono/ui-controls';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  isDarkMode?: boolean;
}

const Reports: React.FC<ReportsProps> = ({ isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });

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

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const exportReport = (format: string) => {
    const reportName = `${activeTab}-report-${new Date().toISOString().split('T')[0]}`;
    alert(`Exporting ${reportName} as ${format.toUpperCase()}`);
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reports & Analytics
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Generate and track business metrics across different categories
          </p>
        </div>

        {/* Date Range & Export */}
        <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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
              <button onClick={() => alert('Report generated!')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
          <div className="flex gap-8">
            {[
              { id: 'sales', label: 'Sales Report' },
              { id: 'users', label: 'User Analytics' },
              { id: 'products', label: 'Product Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
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
      </div>
    </div>
  );
};

export default Reports;
