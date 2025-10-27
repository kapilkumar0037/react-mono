import { Link, useLocation } from 'react-router-dom';

const components = [
  { name: 'Buttons', path: '/components/buttons' },
  { name: 'Checkboxes', path: '/components/checkboxes' },
  { name: 'Dropdowns', path: '/components/dropdowns' },
  { name: 'Radio Buttons', path: '/components/radio' },
  { name: 'Textareas', path: '/components/textareas' },
  { name: 'DateTime', path: '/components/datetime' },
  { name: 'Cards', path: '/components/cards' },
  { name: 'Alerts', path: '/components/alerts' },
  { name: 'Badges', path: '/components/badges' },
  { name: 'Breadcrumbs', path: '/components/breadcrumbs' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">Components</div>
      <nav className="space-y-1">
        {components.map((component) => (
          <Link
            key={component.path}
            to={component.path}
            className={`block px-4 py-2 rounded-md text-sm ${
              location.pathname === component.path
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {component.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};