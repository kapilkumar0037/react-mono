
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for last 12 months
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
    { month: 'Jul', sales: 3490, revenue: 4300 },
    { month: 'Aug', sales: 4200, revenue: 5100 },
    { month: 'Sep', sales: 3800, revenue: 4500 },
    { month: 'Oct', sales: 4100, revenue: 5200 },
    { month: 'Nov', sales: 4900, revenue: 6100 },
    { month: 'Dec', sales: 5200, revenue: 6800 },
  ];

  // Mock data for sales by category
  const salesByCategory = [
    { name: 'Electronics', value: 4000 },
    { name: 'Clothing', value: 3000 },
    { name: 'Home & Garden', value: 2800 },
    { name: 'Sports', value: 2200 },
    { name: 'Books', value: 1800 },
  ];

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Mock recent orders data
  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: '$1,234.50', status: 'Completed', date: '2025-01-28' },
    { id: '#ORD002', customer: 'Jane Smith', amount: '$2,345.00', status: 'Pending', date: '2025-01-27' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: '$890.25', status: 'Shipped', date: '2025-01-26' },
    { id: '#ORD004', customer: 'Sarah Williams', amount: '$3,456.75', status: 'Completed', date: '2025-01-25' },
    { id: '#ORD005', customer: 'Tom Brown', amount: '$567.90', status: 'Processing', date: '2025-01-24' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 p-8">
          <h1 className="text-xl font-semibold mb-4 text-blue-900 tracking-tight">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat cards with icons and modern design */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-xs font-medium mb-1">Users</div>
                <div className="text-2xl font-bold text-gray-900">1,234</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <svg width="20" height="20" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-xs font-medium mb-1">Sales</div>
                <div className="text-2xl font-bold text-gray-900">$12,345</div>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <svg width="20" height="20" fill="currentColor" className="text-green-600" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="2"/></svg>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-xs font-medium mb-1">Active</div>
                <div className="text-2xl font-bold text-gray-900">567</div>
              </div>
              <div className="bg-purple-100 rounded-lg p-2">
                <svg width="20" height="20" fill="currentColor" className="text-purple-600" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-xs font-medium mb-1">Pending</div>
                <div className="text-2xl font-bold text-gray-900">89</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-2">
                <svg width="20" height="20" fill="currentColor" className="text-orange-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Order
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-6 py-3 font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New User
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg px-6 py-3 font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                View Settings
              </button>
            </div>
          </div>

          {/* Placeholder for charts */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
              <div className="text-lg font-semibold mb-4 text-gray-900">Sales & Revenue - Last 12 Months</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                    cursor={{ fill: '#f3f4f6' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '1rem' }} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row - Sales by Category and Recent Orders */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pie Chart - Sales by Category */}
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
              <div className="text-lg font-semibold mb-4 text-gray-900">Sales by Category</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}k`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}k`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
              <div className="text-lg font-semibold mb-4 text-gray-900">Recent Orders</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">View all orders →</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
