import React from 'react';

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  size = 'md',
  label = 'Close',
  className = '',
  ...props
}) => {
  let sizeClass = 'w-6 h-6 text-base';
  if (size === 'sm') sizeClass = 'w-4 h-4 text-xs';
  if (size === 'lg') sizeClass = 'w-8 h-8 text-lg';

  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${sizeClass} ${className}`}
      {...props}
    >
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 pointer-events-none">
        <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
};
