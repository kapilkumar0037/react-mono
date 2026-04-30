import { useState, useCallback } from 'react';
import { useGlobalToast, ToastType } from './useGlobalToast';

export type ActionType = 'create' | 'update' | 'delete' | 'export' | 'restore' | 'import' | 'custom';

interface ActionFeedbackOptions {
  type: ActionType;
  itemName?: string;
  onError?: (error: Error) => void;
  toastDuration?: number;
}

interface ActionState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for managing standardized action feedback with loading, success, and error states.
 * Automatically shows appropriate toasts and manages loading state.
 */
export function useActionFeedback(options: ActionFeedbackOptions) {
  const { type, itemName = 'item', onError, toastDuration = 5000 } = options;
  const { addToast } = useGlobalToast();
  const [state, setState] = useState<ActionState>({
    isLoading: false,
    error: null,
  });

  const getMessages = (actionType: ActionType) => {
    const item = itemName ? ` "${itemName}"` : '';
    const messages: Record<ActionType, { success: string; error: string }> = {
      create: {
        success: `${itemName} created successfully`,
        error: `Failed to create ${itemName}`,
      },
      update: {
        success: `${itemName} updated successfully`,
        error: `Failed to update ${itemName}`,
      },
      delete: {
        success: `${itemName} deleted successfully`,
        error: `Failed to delete ${itemName}`,
      },
      export: {
        success: `${itemName} exported successfully`,
        error: `Failed to export ${itemName}`,
      },
      restore: {
        success: `${itemName} restored successfully`,
        error: `Failed to restore ${itemName}`,
      },
      import: {
        success: `${itemName} imported successfully`,
        error: `Failed to import ${itemName}`,
      },
      custom: {
        success: `Operation completed successfully`,
        error: `Operation failed`,
      },
    };
    return messages[actionType] || messages.custom;
  };

  const execute = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        showSuccess?: boolean;
      }
    ): Promise<{ success: boolean; data?: T; error?: Error }> => {
      setState({ isLoading: true, error: null });

      try {
        const data = await asyncFn();
        setState({ isLoading: false, error: null });

        if (options?.showSuccess !== false) {
          addToast({
            type: 'success',
            message: options?.successMessage || getMessages(type).success,
            duration: toastDuration,
          });
        }

        return { success: true, data };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ isLoading: false, error: err });

        addToast({
          type: 'error',
          message: options?.errorMessage || getMessages(type).error,
          duration: toastDuration,
        });

        onError?.(err);
        return { success: false, error: err };
      }
    },
    [type, addToast, toastDuration, onError]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Specialized hook for delete operations that typically require confirmation
 */
export function useDeleteAction(itemName: string = 'item') {
  return useActionFeedback({
    type: 'delete',
    itemName,
  });
}

/**
 * Specialized hook for create operations
 */
export function useCreateAction(itemName: string = 'item') {
  return useActionFeedback({
    type: 'create',
    itemName,
  });
}

/**
 * Specialized hook for update operations
 */
export function useUpdateAction(itemName: string = 'item') {
  return useActionFeedback({
    type: 'update',
    itemName,
  });
}

/**
 * Specialized hook for export operations
 */
export function useExportAction(itemName: string = 'data') {
  return useActionFeedback({
    type: 'export',
    itemName,
  });
}
