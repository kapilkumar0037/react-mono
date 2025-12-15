import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ComponentItem {
  name: string;
  path: string;
}

interface SubGroup {
  name: string;
  items: ComponentItem[];
}

interface ComponentGroup {
  name: string;
  icon?: React.ReactNode;
  subGroups: SubGroup[];
}

const componentGroups: ComponentGroup[] = [
  {
    name: 'Form Controls',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Basic Inputs',
        items: [
          { name: 'Buttons', path: '/components/buttons' },
          { name: 'Button Group', path: '/components/button-group' },
          { name: 'Checkboxes', path: '/components/checkboxes' },
          { name: 'Radio Buttons', path: '/components/radio' },
        ]
      },
      {
        name: 'Advanced Inputs',
        items: [
          { name: 'Dropdowns', path: '/components/dropdowns' },
          { name: 'Textareas', path: '/components/textareas' },
          { name: 'DateTime', path: '/components/datetime' },
        ]
      }
    ]
  },
      {
        name: 'Display Components',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
        subGroups: [
          {
            name: 'Content',
            items: [
              { name: 'Accordion', path: '/components/accordion' },
              { name: 'Carousel', path: '/components/carousel' },
              { name: 'Close Button', path: '/components/close-button' },
              { name: 'Collapse', path: '/components/collapse' },
              { name: 'Input Group', path: '/components/input-group' },
              { name: 'Navs & Tabs', path: '/components/navs-tabs' },
              { name: 'Range', path: '/components/range' },
              { name: 'Cards', path: '/components/cards' },
              { name: 'Badges', path: '/components/badges' },
              { name: 'Pagination', path: '/components/pagination' },
              { name: 'Tooltip', path: '/components/tooltip' },
              { name: 'Popover', path: '/components/popover' },
              { name: 'Scrollspy', path: '/components/scrollspy' },
              { name: 'List Group', path: '/components/list-group' },
            ]
          },
          {
            name: 'Overlays',
            items: [
              { name: 'Modal', path: '/components/modal' },
              { name: 'Off Canvas', path: '/components/off-canvas' },
            ]
          },
          {
            name: 'Loaders',
            items: [
              { name: 'Spinner', path: '/components/spinner' },
            ]
          }
        ]
      },
  {
    name: 'Feedback & Status',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Notifications',
        items: [
          { name: 'Alerts', path: '/components/alerts' },
          { name: 'Toast', path: '/components/toast' },
        ]
      }
    ]
  },
  {
    name: 'Navigation & Structure',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    ),
    subGroups: [
      {
        name: 'Page Navigation',
        items: [
          { name: 'Navbar', path: '/components/navbar' },
          { name: 'Breadcrumbs', path: '/components/breadcrumbs' },
        ]
      }
    ]
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>({});

  // Automatically expand groups and subgroups based on current path
  useEffect(() => {
    const newExpandedGroups: Record<string, boolean> = {};
    const newExpandedSubGroups: Record<string, boolean> = {};

    componentGroups.forEach(group => {
      group.subGroups.forEach(subGroup => {
        const hasActiveItem = subGroup.items.some(item => item.path === location.pathname);
        if (hasActiveItem) {
          newExpandedGroups[group.name] = true;
          newExpandedSubGroups[subGroup.name] = true;
        }
      });
    });

    setExpandedGroups(newExpandedGroups);
    setExpandedSubGroups(newExpandedSubGroups);
  }, [location.pathname]);

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

  return (
    <div className="w-64 min-h-screen bg-blue-900 flex flex-col">
      <div className="text-xl font-bold mb-6 text-blue-100 px-6 pt-6">Components</div>
      <nav className="flex-1 flex flex-col gap-2 px-2 pb-6">
        {componentGroups.map((group) => (
          <div key={group.name} className="pb-2">
            <button
              onClick={() => toggleGroup(group.name)}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-semibold text-blue-200 rounded-none hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 transition-colors border-none shadow-none bg-transparent"
              style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}
            >
              <div className="flex items-center gap-2">
                {group.icon}
                <span>{group.name}</span>
              </div>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  expandedGroups[group.name] ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedGroups[group.name] && (
              <div className="mt-1 ml-2">
                {group.subGroups.map((subGroup) => (
                  <div key={subGroup.name} className="mb-2">
                    <button
                      onClick={() => toggleSubGroup(subGroup.name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-blue-200 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800 rounded-none transition-colors border-none shadow-none bg-transparent"
                      style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}
                    >
                      <span>{subGroup.name}</span>
                      <svg
                        className={`w-3 h-3 transform transition-transform ${
                          expandedSubGroups[subGroup.name] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedSubGroups[subGroup.name] && (
                      <div className="ml-2 mt-1 flex flex-col gap-1">
                        {subGroup.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-3 py-2 rounded-none text-sm transition-colors border-none shadow-none ${
                              location.pathname === item.path
                                ? 'bg-blue-700 text-white'
                                : 'text-blue-100 hover:bg-blue-800 focus:bg-blue-800 active:bg-blue-800'
                            }`}
                            style={{ boxShadow: 'none', border: 'none' }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};