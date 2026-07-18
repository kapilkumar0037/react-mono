import React, { forwardRef, useEffect, useRef } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text or elements to display next to checkbox */
  children?: React.ReactNode;
  /** Indeterminate state for "select all" */
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', children, indeterminate, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) || innerRef;

    useEffect(() => {
      if (resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          {...props}
          ref={resolvedRef}
          type="checkbox"
          className={`
            w-4 h-4 
            border border-primary/20 rounded 
            bg-background
            checked:bg-primary checked:border-primary
            hover:border-primary/50
            focus:ring-2 focus:ring-primary/20 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${className}
          `.trim()}
        />
        {children && (
          <span className="text-sm select-none">
            {children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
