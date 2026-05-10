import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  persistSidebarExpandedGroups,
  readStoredSidebarExpandedGroups,
} from './authStorage';
import { AppPermission, AppRole, DEFAULT_ROLE_DEFINITIONS, RoleDefinition, hasPermission } from './rbac';

interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  permission?: AppPermission;
}

interface MenuGroup {
  name: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const DEFAULT_EXPANDED_GROUPS = ['Dashboard', 'Management'];

const AdminSidebar: React.FC<{
  collapsed?: boolean;
  isDarkMode?: boolean;
  currentRole: AppRole;
  definitions?: Record<AppRole, RoleDefinition>;
  mobileOpen?: boolean;
  onRequestClose?: () => void;
}> = ({
  collapsed = false,
  isDarkMode = false,
  currentRole,
  definitions = DEFAULT_ROLE_DEFINITIONS,
  mobileOpen = false,
  onRequestClose,
}) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    readStoredSidebarExpandedGroups(DEFAULT_EXPANDED_GROUPS)
  );
  const isCollapsedView = collapsed && !mobileOpen;

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
          permission: 'dashboard.view',
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
          permission: 'orders.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m4 4h.01M12 17h4" />
            </svg>
          ),
        },
        {
          label: 'Inventory',
          to: '/inventory',
          permission: 'inventory.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          ),
        },
        {
          label: 'Billing',
          to: '/billing-subscriptions',
          permission: 'billing.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 .895-4 2s1.79 2 4 2 4 .895 4 2-1.79 2-4 2m0-10c1.861 0 3.41.638 3.858 1.5M12 8V6m0 12v-2m0 0c-1.861 0-3.41-.638-3.858-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: 'Integrations',
          to: '/integrations',
          permission: 'integrations.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: 'Customers',
          to: '/customers',
          permission: 'customers.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        {
          label: 'Returns',
          to: '/returns-refunds',
          permission: 'returns.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11M9 21l-6-6 6-6m12-2v12m0 0l-3-3m3 3l3-3" />
            </svg>
          ),
        },
        {
          label: 'Users',
          to: '/users',
          permission: 'users.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-7a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0zM6 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          label: 'Support',
          to: '/support-tickets',
          permission: 'support.view',
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
          permission: 'settings.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          ),
        },
        {
          label: 'Access Control',
          to: '/access-control',
          permission: 'rbac.manage',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          permission: 'reports.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6m4 6V7m4 10v-3M5 21h14" />
            </svg>
          ),
        },
        {
          label: 'Activity Log',
          to: '/activity',
          permission: 'activity.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          label: 'Notifications',
          to: '/notifications',
          permission: 'notifications.view',
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
          permission: 'system.view',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h4l3-8 4 16 3-8h2" />
            </svg>
          ),
        },
        {
          label: 'Backup & Recovery',
          to: '/backup-recovery',
          permission: 'backup.manage',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-5l-4-4m0 0L8 11m4-4v12" />
            </svg>
          ),
        },
        {
          label: 'API Keys',
          to: '/api-keys',
          permission: 'apiKeys.manage',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 114 0 2 2 0 01-4 0zm-1.586 5.414l-5.828 5.829a2 2 0 01-2.828 0l-.586-.586a2 2 0 010-2.828l5.829-5.829m3.413 3.414l2 2" />
            </svg>
          ),
        },
      ]
    },
  ];

  const visibleMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.permission ? hasPermission(currentRole, item.permission, definitions) : true
      ),
    }))
    .filter((group) => group.items.length > 0);

  const isActive = (path: string) => location.pathname === path;

  const activeGroupName = visibleMenuGroups.find((group) =>
    group.items.some((item) => isActive(item.to))
  )?.name;

  useEffect(() => {
    persistSidebarExpandedGroups(expandedGroups);
  }, [expandedGroups]);

  useEffect(() => {
    if (!activeGroupName) {
      return;
    }

    setExpandedGroups((current) =>
      current.includes(activeGroupName) ? current : [...current, activeGroupName]
    );
  }, [activeGroupName]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={onRequestClose}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 transform flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:relative md:z-auto md:w-auto md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'md:w-20' : 'md:w-60'}`}
      >
      {/* Header */}
      <div className={`h-[50px] border-b border-gray-100 px-4 py-2.5 ${isCollapsedView ? 'flex justify-center' : ''}`}>
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-extrabold text-gray-900">
          {isCollapsedView ? 'A' : <><span className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-orange-600 ring-2 ring-orange-500">◉</span><span>SmartHR</span></>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-5">
        {visibleMenuGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className={`flex w-full items-center rounded-md px-2 py-2 text-gray-800 transition-colors hover:bg-gray-100 ${isCollapsedView ? 'justify-center' : 'gap-3'}`}
              title={isCollapsedView ? group.name : undefined}
              aria-expanded={expandedGroups.includes(group.name)}
            >
              <span className="text-gray-500">
                {group.icon}
              </span>
              {!isCollapsedView && (
                <>
                  <span className="flex-1 text-left text-sm font-bold">{group.name}</span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${expandedGroups.includes(group.name) ? 'rotate-180' : ''}`}
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
              <div className={`space-y-1 ${isCollapsedView ? '' : 'ml-6'}`}>
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onRequestClose}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive(item.to)
                        ? 'border-l-2 border-orange-500 bg-gray-100 font-bold text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${isCollapsedView ? 'flex justify-center' : ''}`}
                    title={isCollapsedView ? item.label : undefined}
                  >
                    {isCollapsedView ? item.icon : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-gray-100 p-4 ${isCollapsedView ? 'text-center' : ''}`}>
        <p className="text-xs text-gray-500">
          {isCollapsedView ? 'v1.0' : 'Admin Dashboard v1.0.0'}
        </p>
      </div>
      </div>
    </>
  );
};

export default AdminSidebar;
