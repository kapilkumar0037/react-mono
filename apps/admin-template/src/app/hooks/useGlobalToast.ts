import { useState, useCallback, useContext, createContext } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GlobalToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const GlobalToastContext = createContext<GlobalToastContextType | null>(null);

export function useGlobalToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, newToast.duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };
}

export function useGlobalToast() {
  const context = useContext(GlobalToastContext);
  if (!context) {
    throw new Error('useGlobalToast must be used within GlobalToastProvider');
  }
  return context;
}
