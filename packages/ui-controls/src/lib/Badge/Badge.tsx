import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  counter?: boolean;
}

export const Badge: FC<PropsWithChildren<BadgeProps>> = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  counter = false,
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: dot ? 'text-xs px-1.5' : 'text-xs px-2 py-0.5',
    md: dot ? 'text-sm px-2' : 'text-sm px-2.5 py-1',
    lg: dot ? 'text-base px-2.5' : 'text-base px-3 py-1.5'
  };

  const shapeClasses = rounded ? 'rounded-full' : 'rounded';
  const dotClasses = dot ? 'flex items-center gap-1.5' : '';
  const counterClasses = counter ? 'min-w-[1.5em] text-center' : '';

  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses} ${dotClasses} ${counterClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span 
          className={`w-2 h-2 rounded-full ${
            variant === 'primary' || variant === 'secondary' 
              ? 'bg-white' 
              : variantClasses[variant].split(' ')[0].replace('100', '500')
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;