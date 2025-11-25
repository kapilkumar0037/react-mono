import React from 'react';
import { Sidebar, SidebarItem } from '@react-mono/ui-controls';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Users', to: '/users' },
  { label: 'Sales', to: '/sales' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
];

const AdminSidebar: React.FC = () => {
  return <Sidebar items={sidebarItems} />;
};

export default AdminSidebar;
