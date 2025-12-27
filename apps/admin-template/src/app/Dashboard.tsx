
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-blue-50">
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 p-8">
          <h1 className="text-xl font-semibold mb-4 text-blue-900 tracking-tight">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat cards with icons and modern design */}
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <svg width="20" height="20" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                </div>
              </div>
              <div className="text-gray-600 text-xs font-medium mb-1">Users</div>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <svg width="20" height="20" fill="currentColor" className="text-green-600" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="2"/></svg>
                </div>
              </div>
              <div className="text-gray-600 text-xs font-medium mb-1">Sales</div>
              <div className="text-2xl font-bold text-gray-900">$12,345</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <svg width="20" height="20" fill="currentColor" className="text-purple-600" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
              </div>
              <div className="text-gray-600 text-xs font-medium mb-1">Active</div>
              <div className="text-2xl font-bold text-gray-900">567</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-100 rounded-lg p-2">
                  <svg width="20" height="20" fill="currentColor" className="text-orange-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
                </div>
              </div>
              <div className="text-gray-600 text-xs font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold text-gray-900">89</div>
            </div>
          </div>
          {/* Placeholder for charts */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
              <div className="text-lg font-semibold mb-4 text-gray-900">Charts & Analytics</div>
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">[Charts will be added here]</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
