import React, { createContext, useContext, useCallback, useState } from 'react';

type AccordionContextType = {
  expandedItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export interface AccordionProps {
  children?: React.ReactNode;
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultExpanded = [],
  allowMultiple = false,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = useCallback((id: string) => {
    setExpandedItems(prev => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  }, [allowMultiple]);

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple }}>
      <div className={`divide-y divide-gray-200 ${className}`} role="tablist">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps {
  children?: React.ReactNode;
  title: React.ReactNode;
  id: string;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  title,
  id,
  className = '',
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within an Accordion');

  const { expandedItems, toggleItem } = context;
  const isExpanded = expandedItems.includes(id);

  return (
    <div className={`${className}`}>
      <h3>
        <button
          type="button"
          onClick={() => toggleItem(id)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-50"
          aria-expanded={isExpanded}
          aria-controls={`accordion-content-${id}`}
          id={`accordion-header-${id}`}
          role="tab"
        >
          <span>{title}</span>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 transform' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      <div
        id={`accordion-content-${id}`}
        role="tabpanel"
        aria-labelledby={`accordion-header-${id}`}
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 text-sm text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;