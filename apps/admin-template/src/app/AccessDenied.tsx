import React from 'react';

interface AccessDeniedProps {
  isDarkMode?: boolean;
  title?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  isDarkMode = false,
  title = 'Access denied',
  message = 'Your current role does not have permission to open this area.',
}) => {
  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Permissions</p>
        <h1 className={`mt-2 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
      </div>
    </div>
  );
};

export default AccessDenied;
