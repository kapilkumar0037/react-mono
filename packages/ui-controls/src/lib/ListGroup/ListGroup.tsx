import React from 'react';

export interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface ListGroupItemProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  as?: React.ElementType;
  onClick?: (e: React.MouseEvent) => void;
}

export const ListGroup: React.FC<ListGroupProps> = ({
  children,
  className = '',
  as: Component = 'ul',
}) => (
  <Component className={className}>
    {children}
  </Component>
);

export const ListGroupItem: React.FC<ListGroupItemProps> = ({
  children,
  active = false,
  disabled = false,
  className = '',
  as: Component = 'li',
  onClick,
}) => {
  // Remove default backgrounds so parent can control it (e.g., sidebar)
  const base = 'block px-4 py-2 text-sm transition-colors';
  const activeCls = active ? 'font-semibold' : '';
  const disabledCls = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  return (
    <Component
      className={`${base} ${activeCls} ${disabledCls} ${className}`}
      aria-current={active ? 'true' : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </Component>
  );
};

export default ListGroup;
