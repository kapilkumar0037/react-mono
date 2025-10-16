import React, { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          {...props}
          ref={ref}
          type="radio"
          className={`
            w-4 h-4
            border border-primary/20 rounded-full
            bg-background
            checked:bg-primary checked:border-primary
            focus:ring-2 focus:ring-primary/20 focus:border-primary
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

Radio.displayName = 'Radio';

export default Radio;
