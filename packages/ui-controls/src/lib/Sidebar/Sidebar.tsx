import React from 'react';
import { ListGroup, ListGroupItem } from '../ListGroup/ListGroup';
import { NavLink, useInRouterContext, BrowserRouter } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const inRouter = useInRouterContext ? useInRouterContext() : false;
  const sidebarContent = (
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 flex flex-col shadow-xl border-r border-gray-900">
      <div className="flex items-center gap-3 p-6 border-b border-gray-900 mb-4">
        <img src='/logo192.png' alt='Logo' className='h-8 w-8 rounded-full shadow-md' />
        <span className="text-xl font-extrabold tracking-wide text-blue-400">AdminPro</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pt-2">
        <ListGroup as="div">
          {items.map((item) => (
            <ListGroupItem key={item.to} className="mb-2" as="div">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full text-base font-medium rounded-lg px-4 py-2 transition-all duration-200 border-l-4 ${
                    isActive
                      ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-lg'
                      : 'bg-gray-900 text-gray-300 border-transparent hover:bg-gray-800 hover:text-blue-200 hover:border-blue-400'
                  }`
                }
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                {item.label}
              </NavLink>
            </ListGroupItem>
          ))}
        </ListGroup>
      </nav>
      <div className="p-4 border-t border-gray-900 text-xs text-gray-500 text-center rounded-b-lg mt-2">© 2025 AdminPro</div>
    </aside>
  );
  return inRouter ? sidebarContent : <BrowserRouter>{sidebarContent}</BrowserRouter>;
};

export default Sidebar;
