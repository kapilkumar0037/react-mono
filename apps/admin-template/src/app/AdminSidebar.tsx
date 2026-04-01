import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  name: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const AdminSidebar: React.FC<{ collapsed?: boolean; isDarkMode?: boolean }> = ({ collapsed = false, isDarkMode = false }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dashboard', 'Management']);

  const menuGroups: MenuGroup[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
        </svg>
      ),
      items: [
        {
          label: 'Overview',
          to: '/',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9" />
            </svg>
          ),
        },
      ]
    },
    {
      name: 'Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      ),
      items: [
        {
          label: 'Orders',
          to: '/orders',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m4 4h.01M12 17h4" />
            </svg>
          ),
        },
        {
          label: 'Inventory',
          to: '/inventory',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          ),
        },
        {
          label: 'Customers',
          to: '/customers',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          label: 'Returns',
          to: '/returns-refunds',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11M9 21l-6-6 6-6m12-2v12m0 0l-3-3m3 3l3-3" />
            </svg>
          ),
        },
        {
          label: 'Users',
          to: '/users',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-7a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0zM6 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          label: 'Support',
          to: '/support-tickets',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8M8 14h5m7 1a2 2 0 01-2 2H9l-4 4V5a2 2 0 012-2h11a2 2 0 012 2v10z" />
            </svg>
          ),
        },
      ]
    },
    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      items: [
        {
          label: 'General Settings',
          to: '/settings',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          ),
        },
      ]
    },
    {
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      items: [
        {
          label: 'Reports',
          to: '/reports',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6m4 6V7m4 10v-3M5 21h14" />
            </svg>
          ),
        },
        {
          label: 'Activity Log',
          to: '/activity',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: 'Notifications',
          to: '/notifications',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
            </svg>
          ),
        },
      ]
    },
    {
      name: 'Administration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      items: [
        {
          label: 'System Health',
          to: '/system-health',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h4l3-8 4 16 3-8h2" />
            </svg>
          ),
        },
        {
          label: 'Backup & Recovery',
          to: '/backup-recovery',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-5l-4-4m0 0L8 11m4-4v12" />
            </svg>
          ),
        },
        {
          label: 'API Keys',
          to: '/api-keys',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 114 0 2 2 0 01-4 0zm-1.586 5.414l-5.828 5.829a2 2 0 01-2.828 0l-.586-.586a2 2 0 010-2.828l5.829-5.829m3.413 3.414l2 2" />
            </svg>
          ),
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-200 ${isDarkMode ? 'bg-gradient-to-b from-gray-800 via-gray-800 to-gray-800' : 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700'} border-r ${isDarkMode ? 'border-gray-700' : 'border-blue-600'} ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-600'} ${collapsed ? 'flex justify-center' : ''}`}>
        <Link to="/" className={`text-lg font-bold text-white whitespace-nowrap`}>
          {collapsed ? 'A' : 'Admin'}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className={`w-full flex items-center px-2 py-2 rounded-md transition-colors text-blue-100 hover:text-white ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-600'
              } ${collapsed ? 'justify-center' : 'gap-3'}`}
              title={collapsed ? group.name : undefined}
            >
              <span className="text-blue-100">
                {group.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium text-left">{group.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedGroups.includes(group.name) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>

            {/* Group Items */}
            {expandedGroups.includes(group.name) && (
              <div className={`space-y-1 ${collapsed ? '' : 'ml-6'}`}>
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(item.to)
                        ? isDarkMode
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-white text-blue-900 font-medium'
                        : isDarkMode
                        ? 'text-blue-100 hover:text-white hover:bg-gray-700'
                        : 'text-blue-100 hover:text-white hover:bg-blue-600'
                    } ${collapsed ? 'flex justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    {collapsed ? item.icon : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-blue-600'} ${collapsed ? 'text-center' : ''}`}>
        <p className="text-xs text-blue-200">
          {collapsed ? 'v1.0' : 'Admin Dashboard v1.0.0'}
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
