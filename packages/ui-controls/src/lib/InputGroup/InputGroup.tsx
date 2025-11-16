import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputGroupProps {
  children: ReactNode;
  className?: string;
}

export interface InputGroupAddonProps {
  children: ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ children, className = '' }, ref) => (
    <div ref={ref} className={`flex rounded border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 bg-white overflow-hidden ${className}`}>
      {children}
    </div>
  )
);
InputGroup.displayName = 'InputGroup';

export const InputGroupAddon = ({ children, position = 'left', className = '' }: InputGroupAddonProps) => (
  <span
    className={`inline-flex items-center px-3 text-gray-500 bg-gray-100 border-gray-300 whitespace-nowrap select-none ${
      position === 'left' ? 'border-r' : 'border-l'
    } ${className}`}
  >
    {children}
  </span>
);

export interface InputGroupInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`flex-1 min-w-0 px-3 py-2 outline-none bg-white border-0 focus:ring-0 ${className}`}
      {...props}
    />
  )
);
InputGroupInput.displayName = 'InputGroupInput';
