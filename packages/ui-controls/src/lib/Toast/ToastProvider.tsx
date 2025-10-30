import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastContainer } from './ToastContainer';
import type { ToastData } from './ToastContainer';
import type { ToastPosition } from './Toast';

interface ToastContextValue {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

let toastCount = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${++toastCount}`;
      setToasts((prev) => {
        const newToasts = [{ ...toast, id }, ...prev];
        // Keep only the most recent toasts up to maxToasts
        return newToasts.slice(0, maxToasts);
      });
    },
    [maxToasts]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} position={position} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};