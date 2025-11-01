import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'default' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Native button component.
 * - forwards ref
 * - accepts all native button props
 * - supports basic variants and sizes
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary-dark',
      secondary: 'bg-white text-primary border border-gray-200 hover:bg-gray-50',
      ghost: 'bg-transparent text-primary hover:bg-gray-50',
      default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const cls = [base, variants[variant], sizes[size], className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={cls} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
