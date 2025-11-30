
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-8">
          <h1 className="text-xl font-semibold mb-4 text-gray-800 tracking-tight">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat cards with icons and modern design */}
            <div className="bg-white rounded-xl shadow p-5 text-center border-t-2 border-blue-200">
              <div className="text-sm font-medium text-blue-700 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-50 text-blue-400 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="7"/></svg></span>
                Users
              </div>
              <div className="text-xl font-bold text-blue-500">1,234</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center border-t-2 border-green-200">
              <div className="text-sm font-medium text-green-700 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-green-50 text-green-400 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><rect x="3" y="7" width="12" height="4"/></svg></span>
                Sales
              </div>
              <div className="text-xl font-bold text-green-500">$12,345</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center border-t-2 border-purple-200">
              <div className="text-sm font-medium text-purple-700 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-purple-50 text-purple-400 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><polygon points="9,2 15,15 3,15"/></svg></span>
                Active
              </div>
              <div className="text-xl font-bold text-purple-500">567</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center border-t-2 border-yellow-200">
              <div className="text-sm font-medium text-yellow-700 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-yellow-50 text-yellow-400 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><ellipse cx="9" cy="9" rx="7" ry="4"/></svg></span>
                Pending
              </div>
              <div className="text-xl font-bold text-yellow-500">89</div>
            </div>
          </div>
          {/* Placeholder for charts */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow p-5 border-t-2 border-blue-100">
              <div className="text-base font-medium mb-2 text-blue-700">Charts & Analytics</div>
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm">[Charts will be added here]</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
