import React from 'react';
import { Toast, ToastPosition } from './Toast';

export interface ToastData {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: ToastPosition;
}

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed z-50 w-full sm:max-w-sm p-4 flex flex-col items-end gap-2 pointer-events-none ${positionStyles[position]}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="w-full pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};