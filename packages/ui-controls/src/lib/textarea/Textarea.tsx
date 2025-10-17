import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label className="inline-flex flex-col gap-1 w-full">
        {children && (
          <span className="text-sm text-text select-none">
            {children}
          </span>
        )}
        <textarea
          ref={ref}
          className={`
            block w-full px-3 py-2 rounded border border-primary/20
            bg-background text-text
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            resize-y
            ${className}
          `.trim()}
          {...props}
        />
      </label>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
