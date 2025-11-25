
import React from 'react';
import AdminSidebar from './AdminSidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat cards will go here */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-xl font-semibold text-gray-700">Users</div>
            <div className="text-4xl font-bold text-blue-500">1,234</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-xl font-semibold text-gray-700">Sales</div>
            <div className="text-4xl font-bold text-green-500">$12,345</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-xl font-semibold text-gray-700">Active</div>
            <div className="text-4xl font-bold text-purple-500">567</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-xl font-semibold text-gray-700">Pending</div>
            <div className="text-4xl font-bold text-yellow-500">89</div>
          </div>
        </div>
        {/* Placeholder for charts */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-xl font-semibold mb-2">Charts Area</div>
            <div className="h-40 flex items-center justify-center text-gray-400">[Charts will be added here]</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
