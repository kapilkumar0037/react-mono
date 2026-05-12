import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useGlobalToast } from './hooks/useGlobalToast';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode = false }) => {
  const { addToast } = useGlobalToast();
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  // User profile
  const userProfile = {
    name: 'Adrian',
    role: 'Manager',
    avatar: '👤',
  };

  // Metric cards
  const metrics = [
    { label: 'Attendance Overview', value: '120/154', change: '+2.3%', color: 'border-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Total H/O Project\'s', value: '90/125', change: '+2.3%', color: 'border-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-900/20' },
    { label: 'Total No of Clients', value: '89/86', change: '+12.3%', color: 'border-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total No of Tasks', value: '252/28', change: '+41.2%', color: 'border-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  ];

  // Employees by department
  const departmentData = [
    { name: 'HR', value: 45 },
    { name: 'Development', value: 120 },
    { name: 'Management', value: 35 },
    { name: 'Testing', value: 28 },
    { name: 'Sales', value: 52 },
  ];

  // Employee status
  const employeeStatus = [
    { name: 'Present', value: 154, color: '#10b981' },
    { name: 'Absent', value: 21, color: '#ef4444' },
    { name: 'Permission', value: 12, color: '#f59e0b' },
    { name: 'Leave', value: 4, color: '#6b7280' },
  ];

  // Clock in/out employees
  const clockInOutData = [
    { name: 'Daniel Estella', dept: 'UI/UX Designer', status: '✓ IN', time: '09:30 AM', badge: 'Present' },
    { name: 'Douglas Marting', dept: 'Tech Developer', status: '✓ IN', time: '08:45 AM', badge: 'Present' },
    { name: 'Brian Villaobs', dept: 'Tech Developer', status: '✓ IN', time: '08:15 AM', badge: 'Present' },
    { name: 'Anthony Lewis', dept: 'Finance', status: '✗ OUT', time: '05:30 PM', badge: 'Out', danger: true },
  ];

  // Jobs applicants
  const jobApplicants = [
    { name: 'Brian Villaobs', position: 'Exp: 0+ Years • USA', status: 'Interviewed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'Anthony Lewis', position: 'Exp: 0+ Years • USA', status: 'Follow-Update', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { name: 'Stephen Peorit', position: 'Exp: 0+ Years • USA', status: 'Rejected-Offer', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
    { name: 'Douglas Marting', position: 'Exp: 0+ Years • USA', status: 'Rejected-Offer', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
  ];

  // Employees table
  const employees = [
    { name: 'Anthony Lewis', dept: 'Finance', status: 'Active' },
    { name: 'Brian Villaobs', dept: 'Tech Developer', status: 'Active' },
    { name: 'Stephen Peorit', dept: 'Marketing', status: 'Active' },
    { name: 'Douglas Marting', dept: 'Manager', status: 'Active' },
    { name: 'Coronie Walters', dept: 'UI/UX Design', status: 'Active' },
  ];

  // Todo items
  const todoItems = [
    { id: 1, title: 'Add Holidays', completed: false },
    { id: 2, title: 'Add Meeting to Client', completed: false },
    { id: 3, title: 'Chat with Adrian', completed: false },
    { id: 4, title: 'Management Call', completed: false },
    { id: 5, title: 'Add Payroll', completed: false },
  ];

  // Sales overview
  const salesData = [
    { month: 'Jan', Income: 40000, Expenses: 24000 },
    { month: 'Feb', Income: 30000, Expenses: 13980 },
    { month: 'Mar', Income: 20000, Expenses: 9800 },
    { month: 'Apr', Income: 27800, Expenses: 39080 },
    { month: 'May', Income: 18900, Expenses: 48000 },
    { month: 'Jun', Income: 23900, Expenses: 38000 },
    { month: 'Jul', Income: 34900, Expenses: 43000 },
    { month: 'Aug', Income: 42000, Expenses: 51000 },
    { month: 'Sep', Income: 38000, Expenses: 45000 },
    { month: 'Oct', Income: 41000, Expenses: 52000 },
    { month: 'Nov', Income: 49000, Expenses: 61000 },
    { month: 'Dec', Income: 52000, Expenses: 68000 },
  ];

  // Invoices
  const invoices = [
    { id: 'Redesign Website', amount: '$4800', status: 'Unpaid', color: 'text-red-600' },
    { id: 'Module Completion', amount: '$1875', status: 'Unpaid', color: 'text-red-600' },
    { id: 'Change on Erp Module', amount: '$2000 + ... LLP', status: 'Unpaid', color: 'text-red-600' },
    { id: 'Changes on the Board', amount: '$1345', status: 'Unpaid', color: 'text-red-600' },
    { id: 'Hospital Management', amount: '$6858', status: 'Paid', color: 'text-green-600' },
  ];

  // Projects
  const projects = [
    { id: 'PRO-001', name: 'Office Management App', team: 3, hours: '120/250 Hrs', deadline: '12/09/2025', status: 'High', color: 'text-red-600' },
    { id: 'PRO-002', name: 'Clinic Management', team: 3, hours: '250/250 Hrs', deadline: '26/10/2025', status: 'Medium', color: 'text-yellow-600' },
    { id: 'PRO-003', name: 'Educational Platform', team: 3, hours: '80/120 Hrs', deadline: '18/02/2025', status: 'High', color: 'text-red-600' },
    { id: 'PRO-004', name: 'Chat & Call Mobile App', team: 3, hours: '40/150 Hrs', deadline: '17/10/2025', status: 'Medium', color: 'text-yellow-600' },
    { id: 'PRO-005', name: 'Chat & Call Mobile App', team: 3, hours: '100/300 Hrs', deadline: '17/10/2025', status: 'Medium', color: 'text-yellow-600' },
  ];

  // Tasks statistics
  const tasksStats = [
    { name: 'Ongoing', value: 24, color: '#fbbf24' },
    { name: 'On Hold', value: 10, color: '#3b82f6' },
    { name: 'Overdue', value: 16, color: '#8b5cf6' },
    { name: 'Completed', value: 40, color: '#10b981' },
  ];

  // Schedules
  const schedules = [
    { title: 'Slot Booking', date: 'Thu, 16 Feb 2025', time: '09:00 AM - 10:00 AM' },
    { title: 'Interview Candidates - IOS Developer', date: 'Wed, 26 Feb 2025', time: '10:00 AM - 02:00 AM' },
  ];

  // Recent activities
  const recentActivities = [
    { user: 'Douglas Marting', action: 'Posted New Project HEME Dashboard', time: '06:30 PM' },
    { user: 'Brian Villaobs', action: 'Commented on Updated Document', time: '06:30 PM' },
    { user: 'Harvey Smith', action: 'Approved Task for Module Tasks', time: '06:30 PM' },
    { user: 'Eliot Murray', action: 'Requesting Access for Module Tasks', time: '06:30 PM' },
  ];

  // Birthdays
  const birthdays = [
    { name: 'Andrew Jermia', date: '28 Jun 2025', status: 'Today' },
    { name: 'Denis Walters', date: '28 Jun 2025', status: 'Tomorrow' },
    { name: 'Stephen Peorit', date: '28 Jun 2025', status: 'Soon' },
  ];

  const handleTodoToggle = (id: number) => {
    addToast({ type: 'success', message: 'Todo updated successfully' });
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
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
