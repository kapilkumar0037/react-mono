import React, { useState } from 'react';
import { Card } from '@react-mono/ui-controls';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SystemHealthProps {
  isDarkMode?: boolean;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ isDarkMode = false }) => {
  const [timeRange, setTimeRange] = useState('24h');

  // Mock system health data
  const cpuData = [
    { time: '00:00', usage: 35 },
    { time: '04:00', usage: 28 },
    { time: '08:00', usage: 52 },
    { time: '12:00', usage: 68 },
    { time: '16:00', usage: 45 },
    { time: '20:00', usage: 55 },
    { time: '23:59', usage: 38 },
  ];

  const memoryData = [
    { time: '00:00', used: 4.2, total: 16 },
    { time: '04:00', used: 3.8, total: 16 },
    { time: '08:00', used: 7.2, total: 16 },
    { time: '12:00', used: 9.5, total: 16 },
    { time: '16:00', used: 8.1, total: 16 },
    { time: '20:00', used: 7.8, total: 16 },
    { time: '23:59', used: 5.9, total: 16 },
  ];

  const requestData = [
    { time: '00:00', success: 1240, failed: 45 },
    { time: '04:00', success: 890, failed: 23 },
    { time: '08:00', success: 3250, failed: 120 },
    { time: '12:00', success: 5200, failed: 180 },
    { time: '16:00', success: 4100, failed: 95 },
    { time: '20:00', success: 3800, failed: 110 },
    { time: '23:59', success: 2100, failed: 65 },
  ];

  const diskUsage = [
    { name: 'Used', value: 425 },
    { name: 'Free', value: 575 },
  ];

  const serviceStatus = [
    { name: 'API Server', status: 'healthy', uptime: '99.98%', responseTime: '45ms' },
    { name: 'Database', status: 'healthy', uptime: '99.99%', responseTime: '2ms' },
    { name: 'Cache Server', status: 'healthy', uptime: '99.95%', responseTime: '1ms' },
    { name: 'Queue Service', status: 'warning', uptime: '98.50%', responseTime: '120ms' },
    { name: 'Email Service', status: 'healthy', uptime: '99.80%', responseTime: '250ms' },
    { name: 'CDN', status: 'healthy', uptime: '99.99%', responseTime: '20ms' },
  ];

  const systemMetrics = [
    { label: 'System Uptime', value: '45 days 12 hours', trend: 'up' },
    { label: 'API Response Time', value: '125ms', trend: 'down' },
    { label: 'Error Rate', value: '0.15%', trend: 'down' },
    { label: 'Active Connections', value: '2,450', trend: 'up' },
  ];

  const colors = ['#3B82F6', '#10B981'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '●';
      case 'warning':
        return '⚠';
      case 'critical':
        return '✕';
      default:
        return '○';
    }
  };

  return (
    <div className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              System Health & Status
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor system performance, resource usage, and service status
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>

        {/* System Metrics KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {systemMetrics.map((metric, idx) => (
            <Card key={idx} className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </p>
                <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </p>
                <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`}>
                  {metric.trend === 'up' ? '↑' : '↓'} Trending {metric.trend}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* CPU Usage */}
          <Card title="CPU Usage (%)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                <Area type="monotone" dataKey="usage" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Memory Usage */}
          <Card title="Memory Usage (GB)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={memoryData}>
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
                <Bar dataKey="used" stackId="memory" fill="#3B82F6" name="Used" />
                <Bar dataKey="total" stackId="memory" fill="#E5E7EB" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Request Success Rate */}
          <Card title="API Requests" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={requestData}>
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
                <Bar dataKey="success" fill="#10B981" name="Success" />
                <Bar dataKey="failed" fill="#EF4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Disk Usage */}
          <Card title="Disk Space (GB)" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <div className="flex items-center justify-center h-250">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diskUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}GB`}
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
            </div>
          </Card>
        </div>

        {/* Service Status Table */}
        <Card title="Service Status" className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Service
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Uptime
                  </th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceStatus.map((service, idx) => (
                  <tr
                    key={idx}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {service.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                        <span className="text-lg">{getStatusIcon(service.status)}</span>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {service.uptime}
                    </td>
                    <td className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {service.responseTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Last Updated */}
        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: Today at 2:45 PM • Auto-refresh: Every 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
