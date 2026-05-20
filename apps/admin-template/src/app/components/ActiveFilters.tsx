import React from 'react';

interface ActiveFiltersProps {
  filters: Record<string, any>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  filterLabels?: Record<string, string>;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onClearFilter,
  onClearAll,
  filterLabels = {},
}) => {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== '' &&
      value !== null &&
      (!Array.isArray(value) || value.length > 0)
  );

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Filters:</span>
      {activeFilters.map(([key, value]) => {
        const label = filterLabels[key] || key;
        const displayValue = Array.isArray(value)
          ? value.join(', ')
          : String(value);

        return (
          <div
            key={key}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full text-xs font-medium"
          >
            <span>{label}: {displayValue}</span>
            <button
              onClick={() => onClearFilter(key)}
              className="ml-1 hover:text-blue-700 dark:hover:text-blue-300 font-bold"
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        onClick={onClearAll}
        className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
      >
        Clear All
      </button>
    </div>
  );
};
