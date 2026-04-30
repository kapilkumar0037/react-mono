import React, { ReactNode } from 'react';
import { GlobalToastContext, useGlobalToastProvider } from '../hooks/useGlobalToast';

interface GlobalToastProviderProps {
  children: ReactNode;
}

/**
 * Provider component for global toast functionality
 * Wrap your app with this provider to enable useGlobalToast hook
 */
export function GlobalToastProvider({ children }: GlobalToastProviderProps) {
  const toastState = useGlobalToastProvider();

  return (
    <GlobalToastContext.Provider value={toastState}>
      {children}
    </GlobalToastContext.Provider>
  );
}
