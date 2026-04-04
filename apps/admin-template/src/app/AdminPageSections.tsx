import React from 'react';
import { Button } from '@react-mono/ui-controls';

interface MetricCard {
  label: string;
  value: string;
  tone: string;
}

interface RelatedLink {
  label: string;
  onClick: () => void;
}

export const AdminMetricCards: React.FC<{
  isDarkMode?: boolean;
  items: MetricCard[];
}> = ({ isDarkMode = false, items }) => (
  <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4">
    {items.map((item) => (
      <div
        key={item.label}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-l-4 p-3 shadow ${item.tone}`}
      >
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
          {item.label}
        </div>
        <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

export const AdminFilterFooter: React.FC<{
  isDarkMode?: boolean;
  resultLabel: string;
  resultCount: number;
  activeFilterCount: number;
  onClearFilters: () => void;
}> = ({
  isDarkMode = false,
  resultLabel,
  resultCount,
  activeFilterCount,
  onClearFilters,
}) => (
  <div className="mt-4 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
      Showing {resultCount} {resultLabel}
      {resultCount === 1 ? '' : 's'} in the current view.
      {activeFilterCount > 0 ? ` ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} active.` : ''}
    </div>
    <Button onClick={onClearFilters} className="bg-gray-700 text-white md:w-auto" disabled={activeFilterCount === 0}>
      Clear Filters
    </Button>
  </div>
);

export const AdminEmptyState: React.FC<{
  isDarkMode?: boolean;
  message: string;
}> = ({ isDarkMode = false, message }) => (
  <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    {message}
  </div>
);

export const AdminRelatedLinks: React.FC<{
  isDarkMode?: boolean;
  title?: string;
  links: RelatedLink[];
}> = ({ isDarkMode = false, title = 'Related Actions', links }) => (
  <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((link) => (
        <Button key={link.label} onClick={link.onClick} className="bg-gray-700 text-white">
          {link.label}
        </Button>
      ))}
    </div>
  </div>
);
