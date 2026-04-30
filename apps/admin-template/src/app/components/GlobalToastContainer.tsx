import React from 'react';
import { Toast } from '@react-mono/ui-controls';
import { useGlobalToast } from '../hooks/useGlobalToast';

interface GlobalToastContainerProps {
  isDarkMode?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Container component that displays all global toasts
 * Place this at the top level of your app (e.g., in ProtectedLayout)
 */
export const GlobalToastContainer: React.FC<GlobalToastContainerProps> = ({
  isDarkMode = false,
  position = 'bottom-right',
}) => {
  const { toasts, removeToast } = useGlobalToast();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getToastVariant = (type: string): 'success' | 'danger' | 'warning' | 'info' => {
    const variantMap: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
    };
    return variantMap[type] || 'info';
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 max-w-sm pointer-events-none`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          onClick={() => removeToast(toast.id)}
        >
          <Toast
            show={true}
            variant={getToastVariant(toast.type)}
            onClose={() => removeToast(toast.id)}
            isDarkMode={isDarkMode}
            autohide={true}
            delay={toast.duration || 5000}
          >
            <div className="flex items-start justify-between gap-2">
              <span>{toast.message}</span>
              {toast.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.action!.onClick();
                  }}
                  className={`ml-2 px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    isDarkMode
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                      : 'bg-black bg-opacity-10 hover:bg-opacity-20 text-gray-900'
                  }`}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
          </Toast>
        </div>
      ))}
    </div>
  );
};
