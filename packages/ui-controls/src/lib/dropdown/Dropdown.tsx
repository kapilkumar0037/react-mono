import React, { forwardRef } from 'react';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          block w-full px-3 py-2 rounded border border-primary/20
          bg-background text-text
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
