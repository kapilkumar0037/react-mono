import React from 'react';
import { ListGroup, ListGroupItem } from '../ListGroup/ListGroup';
import { NavLink } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="h-full w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold tracking-wide border-b border-gray-800 mb-2">Admin Dashboard</div>
      <nav className="flex-1 overflow-y-auto">
        <ListGroup>
          {items.map((item) => (
            <ListGroupItem key={item.to} className="px-4 py-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full text-lg rounded transition-colors duration-150 px-2 py-1 ${
                    isActive ? 'bg-gray-800 text-blue-400' : 'hover:bg-gray-800 hover:text-blue-300'
                  }`
                }
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </NavLink>
            </ListGroupItem>
          ))}
        </ListGroup>
      </nav>
    </aside>
  );
};

export default Sidebar;
