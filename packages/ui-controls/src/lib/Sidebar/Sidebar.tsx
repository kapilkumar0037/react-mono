import React, { useState } from 'react';
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
  const [open, setOpen] = useState(true);
  const inRouter = useInRouterContext ? useInRouterContext() : false;
  const sidebarContent = (
    <>
      {/* Toggle button (hamburger) */}
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-blue-800 text-blue-100 hover:bg-blue-700 focus:outline-none md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {/* Hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <aside
        className={`h-screen w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-blue-50 flex flex-col shadow-xl border-r border-blue-900 transition-transform duration-300 fixed md:static z-40 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-blue-800 mb-4">
          {/* Dashboard icon as logo */}
          <span className="bg-blue-700 p-2 rounded-lg shadow-md">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid text-blue-100"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </span>
          <span className="text-xl font-extrabold tracking-wide text-blue-200">AdminPro</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pt-2">
          <ListGroup as="div" className="divide-y divide-blue-800">
            {items.map((item) => (
              <ListGroupItem key={item.to} className="bg-transparent" as="div">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full text-base font-medium rounded-lg px-4 py-2 transition-all duration-200 border-l-4 ${
                      isActive
                        ? 'bg-blue-700 text-white border-blue-300 shadow-lg'
                        : 'bg-blue-900 text-blue-100 border-transparent hover:bg-blue-800 hover:text-white hover:border-blue-400'
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
        <div className="p-4 border-t border-blue-800 text-xs text-blue-200 text-center rounded-b-lg mt-2">© 2025 AdminPro</div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
  return inRouter ? sidebarContent : <BrowserRouter>{sidebarContent}</BrowserRouter>;
};

export default Sidebar;
