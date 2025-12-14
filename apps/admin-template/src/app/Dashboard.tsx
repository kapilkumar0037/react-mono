
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-8">
          <h1 className="text-xl font-semibold mb-4 text-blue-900 tracking-tight">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat cards with icons and modern design */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-xl shadow p-5 text-center border-t-2 border-blue-300">
              <div className="text-sm font-medium text-blue-100 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-800 text-blue-200 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><circle cx="9" cy="9" r="7"/></svg></span>
                Users
              </div>
              <div className="text-xl font-bold text-white">1,234</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl shadow p-5 text-center border-t-2 border-blue-200">
              <div className="text-sm font-medium text-blue-50 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-700 text-blue-100 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><rect x="3" y="7" width="12" height="4"/></svg></span>
                Sales
              </div>
              <div className="text-xl font-bold text-white">$12,345</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 rounded-xl shadow p-5 text-center border-t-2 border-blue-100">
              <div className="text-sm font-medium text-blue-900 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-200 text-blue-700 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><polygon points="9,2 15,15 3,15"/></svg></span>
                Active
              </div>
              <div className="text-xl font-bold text-blue-900">567</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-xl shadow p-5 text-center border-t-2 border-blue-50">
              <div className="text-sm font-medium text-blue-900 mb-1 flex items-center justify-center gap-2">
                <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-1"><svg width="18" height="18" fill="currentColor"><ellipse cx="9" cy="9" rx="7" ry="4"/></svg></span>
                Pending
              </div>
              <div className="text-xl font-bold text-blue-900">89</div>
            </div>
          </div>
          {/* Placeholder for charts */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow p-5 border-t-2 border-blue-100">
              <div className="text-base font-medium mb-2 text-blue-700">Charts & Analytics</div>
              <div className="h-32 flex items-center justify-center text-blue-200 text-sm">[Charts will be added here]</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
