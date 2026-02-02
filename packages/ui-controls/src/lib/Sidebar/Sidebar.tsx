import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from '../ListGroup/ListGroup';
import { NavLink, useInRouterContext, BrowserRouter, useLocation } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

export interface SidebarSubGroup {
  name: string;
  items: SidebarItem[];
}

export interface SidebarGroup {
  name: string;
  icon?: React.ReactNode;
  subGroups: SidebarSubGroup[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  groups?: SidebarGroup[];
  collapsed?: boolean;
}

const SidebarContent: React.FC<SidebarProps> = ({ items, groups, collapsed = false }) => {
  const [open, setOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>({});
  
  let location = null;
  try {
    location = useLocation();
  } catch (e) {
    // Not in router context
  }

  // Automatically expand groups and subgroups based on current path
  useEffect(() => {
    if (!groups || !location) return;
    
    const newExpandedGroups: Record<string, boolean> = {};
    const newExpandedSubGroups: Record<string, boolean> = {};

    groups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        const hasActiveItem = subGroup.items.some(item => item.to === location!.pathname);
        if (hasActiveItem) {
          newExpandedGroups[group.name] = true;
          newExpandedSubGroups[subGroup.name] = true;
        }
      });
    });

    setExpandedGroups(newExpandedGroups);
    setExpandedSubGroups(newExpandedSubGroups);
  }, [location?.pathname, groups]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleSubGroup = (subGroupName: string) => {
    setExpandedSubGroups(prev => ({
      ...prev,
      [subGroupName]: !prev[subGroupName]
    }));
  };
  const sidebarContent = (
    <>
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-blue-800 text-blue-100 border border-blue-700 hover:bg-blue-700 focus:outline-none md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {/* Hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <aside
        className={`min-h-screen h-full bg-blue-900 text-blue-100 flex flex-col shadow-lg border-r border-blue-800 transition-all duration-300 fixed md:static z-40 ${
          collapsed ? 'w-20' : 'w-64'
        } ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          width: collapsed ? '5rem' : '16rem'
        }}
      >
        <div className={`flex items-center border-b border-blue-800 transition-all duration-300 h-14 ${
          collapsed ? 'justify-center px-2' : 'justify-start px-6'
        }`}>
          {!collapsed && <span className="font-bold text-blue-100 text-xl">AdminPro</span>}
          {collapsed && <span className="text-lg font-bold text-blue-100">A</span>}
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pt-2">
          {groups ? (
            // Hierarchical menu with groups and subgroups
            <div className="flex flex-col gap-2">
              {groups.map((group) => (
                <div key={group.name} className="pb-2">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={`w-full flex items-center transition-all duration-300 text-left text-sm font-semibold text-blue-100 rounded-none hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 ${
                      collapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                    }`}
                    title={collapsed ? group.name : ''}
                  >
                    <div className={`flex items-center ${collapsed ? 'gap-0' : 'gap-2'}`}>
                      {group.icon}
                      <span className={collapsed ? 'hidden' : ''}>{group.name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        expandedGroups[group.name] ? 'rotate-180' : ''
                      } ${collapsed ? 'hidden' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedGroups[group.name] && !collapsed && (
                    <div className="mt-1 ml-2">
                      {group.subGroups.map((subGroup) => (
                        <div key={subGroup.name} className="mb-2">
                          <button
                            onClick={() => toggleSubGroup(subGroup.name)}
                            className={`w-full flex items-center transition-all duration-300 text-left text-sm text-blue-200 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 rounded-none ${
                              collapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                            }`}
                          >
                            <span className={collapsed ? 'hidden' : ''}>{subGroup.name}</span>
                            <svg
                              className={`w-3 h-3 transform transition-transform ${
                                expandedSubGroups[subGroup.name] ? 'rotate-180' : ''
                              } ${collapsed ? 'hidden' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {expandedSubGroups[subGroup.name] && !collapsed && (
                            <div className="ml-2 mt-1 flex flex-col gap-1">
                              {subGroup.items.map((item) => (
                                <NavLink
                                  key={item.to}
                                  to={item.to}
                                  className={({ isActive }) =>
                                    `block px-3 py-2 rounded-none text-sm transition-colors ${
                                      isActive
                                        ? 'bg-blue-700 text-white font-medium'
                                        : 'text-blue-100 hover:bg-blue-800'
                                    }`
                                  }
                                  title={collapsed ? item.label : ''}
                                >
                                  {item.label}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Flat menu for simple items
            <ListGroup as="div" className="divide-y divide-blue-800 bg-blue-900">
              {items?.map((item) => (
                <ListGroupItem key={item.to} className="bg-blue-900" as="div">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full text-base font-medium rounded-none transition-all duration-200 border-l-4 ${
                        collapsed
                          ? 'justify-center px-2 py-2'
                          : 'px-4 py-2'
                      } ${
                        isActive
                          ? 'bg-blue-700 text-white border-blue-300 shadow-sm'
                          : 'bg-blue-900 text-blue-100 border-transparent hover:bg-blue-800 hover:text-white hover:border-blue-400'
                      }`
                    }
                    title={collapsed ? item.label : ''}
                  >
                    {item.icon && <span className="text-xl">{item.icon}</span>}
                    <span className={collapsed ? 'hidden' : ''}>{item.label}</span>
                  </NavLink>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </nav>
        <div className={`border-t border-blue-800 text-xs text-blue-300 text-center bg-blue-900 transition-all duration-300 mt-auto ${
          collapsed ? 'p-2 hidden md:block' : 'p-4'
        }`}>© 2025 AdminPro</div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );

  return sidebarContent;
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const inRouter = useInRouterContext ? useInRouterContext() : false;
  
  if (!inRouter) {
    return <BrowserRouter><SidebarContent {...props} /></BrowserRouter>;
  }
  
  return <SidebarContent {...props} />;
};

export default Sidebar;
