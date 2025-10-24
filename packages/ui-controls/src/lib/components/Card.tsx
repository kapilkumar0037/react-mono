import React from 'react';

export type CardVariant = 'default' | 'bordered' | 'elevated';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Style variant of the card */
  variant?: CardVariant;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  header,
  footer,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-background rounded-lg overflow-hidden';
  
  const variantClasses = {
    default: 'border border-primary/10',
    bordered: 'border-2 border-primary/20',
    elevated: 'shadow-lg border border-primary/5'
  }[variant];

  return (
    <div 
      className={`
        ${baseClasses}
        ${variantClasses}
        ${className}
      `.trim()}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-primary/10 bg-primary/5">
          {header}
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
