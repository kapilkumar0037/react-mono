import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isDarkMode?: boolean;
}

/**
 * Reusable empty state component for when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  isDarkMode = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-gray-50'}`}>
      {icon && (
        <div className={`text-5xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          {icon}
        </div>
      )}
      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-sm mb-6 text-center max-w-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
