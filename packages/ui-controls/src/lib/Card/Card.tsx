import { FC, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`px-6 py-4 flex gap-2 items-center ${className}`} {...props}>
    {children}
  </div>
);

const Card = forwardRef<HTMLDivElement, PropsWithChildren<CardProps>>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-card',
      bordered: 'bg-card border border-border rounded-lg',
      elevated: 'bg-card shadow-lg rounded-lg',
    };

    return (
      <div
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Add display names
Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardContent.displayName = 'Card.Content';
CardFooter.displayName = 'Card.Footer';

// Attach subcomponents to Card
(Card as any).Header = CardHeader;
(Card as any).Content = CardContent;
(Card as any).Footer = CardFooter;

export { Card };