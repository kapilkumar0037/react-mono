import React, { ReactNode } from 'react';

export interface NavProps {
  children: ReactNode;
  className?: string;
  variant?: 'tabs' | 'pills' | 'underline';
}

export function Nav({ children, className = '', variant = 'tabs' }: NavProps) {
  let base = 'flex flex-wrap';
  let variantClass = '';
  if (variant === 'tabs') variantClass = 'border-b border-gray-200';
  if (variant === 'pills') variantClass = '';
  if (variant === 'underline') variantClass = 'border-b border-gray-200';
  return (
    <nav className={`${base} ${variantClass} ${className}`}>{children}</nav>
  );
}

export interface NavItemProps {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  as?: React.ElementType;
}

export function NavItem({
  children,
  active = false,
  disabled = false,
  onClick,
  className = '',
  as: Component = 'button',
}: NavItemProps) {
  return (
    <Component
      className={`px-4 py-2 text-sm font-medium focus:outline-none transition
        ${active ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      onClick={disabled ? undefined : onClick}
      type={Component === 'button' ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}

export interface TabsProps {
  tabs: { label: ReactNode; content: ReactNode; disabled?: boolean }[];
  initialIndex?: number;
  className?: string;
}

export function Tabs({ tabs, initialIndex = 0, className = '' }: TabsProps) {
  const [active, setActive] = React.useState(initialIndex);
  return (
    <div className={className}>
      <Nav variant="tabs">
        {tabs.map((tab, i) => (
          <NavItem
            key={i}
            active={active === i}
            disabled={tab.disabled}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </NavItem>
        ))}
      </Nav>
      <div className="mt-4">{tabs[active]?.content}</div>
    </div>
  );
}
