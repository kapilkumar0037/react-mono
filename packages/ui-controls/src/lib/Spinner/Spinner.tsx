import React from 'react';

export type SpinnerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'inherit' | 'primary' | 'muted' | 'white';
export type SpinnerVisual = 'border' | 'classic';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  visual?: SpinnerVisual;
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, { size: string, border: string }> = {
  '2xs': { size: 'w-3 h-3', border: 'border-2' },
  xs: { size: 'w-4 h-4', border: 'border-2' },
  sm: { size: 'w-5 h-5', border: 'border-2' },
  md: { size: 'w-6 h-6', border: 'border-[3px]' },
  lg: { size: 'w-8 h-8', border: 'border-[3px]' },
};

const variantMap: Record<SpinnerVariant, { color: string, track: string }> = {
  inherit: { color: 'border-current', track: 'border-current/20' },
  primary: { color: 'border-primary', track: 'border-primary/20' },
  muted: { color: 'border-gray-400', track: 'border-gray-200' },
  white: { color: 'border-white', track: 'border-white/20' },
};

/**
 * Spinner
 * - Accessible: uses role="status" and optional label for screen readers
 * - Configurable sizes and color variants
 * - Two styles: border (CSS-based) or classic (SVG-based)
 * - Uses Tailwind's `animate-spin`
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'xs',
  variant = 'inherit',
  visual = 'border',
  label = 'Loading',
  className = '',
  ...rest
}) => {
  const { size: sizeCls, border: borderWidth } = sizeMap[size] || sizeMap.xs;
  const { color: borderColor, track: trackColor } = variantMap[variant] || variantMap.inherit;

  if (visual === 'border') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={label}
        className={`inline-flex items-center ${className}`}
        {...rest}
      >
        <div
          className={`
            ${sizeCls}
            ${borderWidth}
            ${borderColor}
            ${trackColor}
            animate-spin
            rounded-full
            border-solid
            border-t-transparent
            border-r-transparent
          `}
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Classic SVG spinner
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center ${className}`}
      {...rest}
    >
      <svg
        className={`${sizeCls} animate-spin ${variant === 'inherit' ? 'text-current' : variantMap[variant].color.replace('border-', 'text-')}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          fill="currentColor" 
          d="M12 4.75v1.5a5.75 5.75 0 1 0 5.75 5.75h1.5A7.25 7.25 0 1 1 12 4.75Z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};


export default Spinner;
