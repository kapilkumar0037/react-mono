import React from 'react';

interface LoadingStateProps {
  message?: string;
  isDarkMode?: boolean;
}

/**
 * Reusable loading state component with spinner
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  isDarkMode = false,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
      <div className="mb-4">
        <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isDarkMode ? 'border-gray-700 border-t-blue-500' : 'border-gray-300 border-t-blue-600'}`} />
      </div>
      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
