import React, { forwardRef } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text or elements to display next to checkbox */
  children?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          {...props}
          ref={ref}
          type="checkbox"
          className={`
            w-4 h-4 
            border border-gray-300 rounded 
            bg-white
            text-primary 
            focus:ring-2 focus:ring-primary/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `.trim()}
        />
        {children && (
          <span className="text-sm text-gray-700 select-none">
            {children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
