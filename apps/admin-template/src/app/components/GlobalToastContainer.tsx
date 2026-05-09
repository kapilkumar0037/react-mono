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
  position = 'bottom-right',
}) => {
  const { toasts, removeToast } = useGlobalToast();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getToastVariant = (type: string): 'success' | 'error' | 'warning' | 'info' => {
    const variantMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
      success: 'success',
      error: 'error',
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
            id={toast.id}
            message={toast.message}
            variant={getToastVariant(toast.type)}
            duration={toast.duration || 5000}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};
