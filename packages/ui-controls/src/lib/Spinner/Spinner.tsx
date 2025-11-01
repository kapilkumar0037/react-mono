import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'muted' | 'white' | 'black';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string; // accessible label
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

const variantMap: Record<SpinnerVariant, string> = {
  primary: 'text-primary',
  muted: 'text-gray-400',
  white: 'text-white',
  black: 'text-black',
};

/**
 * Spinner
 * - Accessible: uses role="status" and optional label for screen readers
 * - Configurable sizes and color variants
 * - Uses Tailwind's `animate-spin`
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading',
  className = '',
  ...rest
}) => {
  const sizeCls = sizeMap[size] || sizeMap.md;
  const variantCls = variantMap[variant] || variantMap.primary;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      {...rest}
    >
      <svg
        className={`${sizeCls} ${variantCls} animate-spin`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      {/* Visible label for assistive tech only */}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
