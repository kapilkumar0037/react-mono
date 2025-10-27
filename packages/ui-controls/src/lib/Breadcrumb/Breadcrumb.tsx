import { FC, ReactNode } from 'react';

export interface BreadcrumbItemProps {
  /** The content to display */
  children: ReactNode;
  /** Whether this item is the last/current item */
  isCurrent?: boolean;
  /** Optional href for navigation */
  href?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional icon to display before the text */
  icon?: ReactNode;
}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  children,
  isCurrent = false,
  href,
  onClick,
  icon
}) => {
  const className = `
    inline-flex items-center gap-1.5
    ${isCurrent 
      ? 'text-text font-semibold cursor-default'
      : 'text-text/60 hover:text-text/80 cursor-pointer'
    }
  `.trim();

  const content = (
    <>
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </>
  );

  if (href && !isCurrent) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  if (onClick && !isCurrent) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
};

export interface BreadcrumbProps {
  /** The breadcrumb items */
  children: ReactNode;
  /** Custom separator between items */
  separator?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  children,
  separator = '/',
  className = ''
}) => {
  const items = Array.isArray(children) ? children : [children];
  
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item}
            {index < items.length - 1 && (
              <span className="mx-2 text-text/40" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

BreadcrumbItem.displayName = 'Breadcrumb.Item';
Breadcrumb.displayName = 'Breadcrumb';

// Attach BreadcrumbItem as a static property
(Breadcrumb as any).Item = BreadcrumbItem;

// Export the combined component
export default Object.assign(Breadcrumb, { Item: BreadcrumbItem });