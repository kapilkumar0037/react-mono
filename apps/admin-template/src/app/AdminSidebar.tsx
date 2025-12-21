import React from 'react';
import { Sidebar, SidebarGroup } from '@react-mono/ui-controls';

const sidebarGroups: SidebarGroup[] = [
  {
    name: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Overview',
        items: [
          { label: 'Dashboard', to: '/' },
          { label: 'Analytics', to: '/analytics' },
        ]
      }
    ]
  },
  {
    name: 'Management',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Users',
        items: [
          { label: 'User List', to: '/users' },
          { label: 'Add User', to: '/users/add' },
          { label: 'User Roles', to: '/users/roles' },
        ]
      },
      {
        name: 'Sales',
        items: [
          { label: 'Sales Dashboard', to: '/sales' },
          { label: 'Orders', to: '/sales/orders' },
          { label: 'Invoices', to: '/sales/invoices' },
        ]
      }
    ]
  },
  {
    name: 'Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Reports',
        items: [
          { label: 'Sales Reports', to: '/reports/sales' },
          { label: 'User Reports', to: '/reports/users' },
          { label: 'Custom Reports', to: '/reports/custom' },
        ]
      }
    ]
  },
  {
    name: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Configuration',
        items: [
          { label: 'General Settings', to: '/settings/general' },
          { label: 'Security', to: '/settings/security' },
          { label: 'Preferences', to: '/settings/preferences' },
        ]
      }
    ]
  }
];

const AdminSidebar: React.FC = () => {
  return <Sidebar groups={sidebarGroups} />;
};

export default AdminSidebar;
