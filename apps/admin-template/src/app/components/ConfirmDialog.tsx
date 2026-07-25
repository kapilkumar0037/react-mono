import React from 'react';
import { Modal, Button, Spinner } from '@react-mono/ui-controls';

export interface ConfirmDialogOptions {
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogProps extends ConfirmDialogOptions {
  isOpen: boolean;
  isDarkMode?: boolean;
}

/**
 * Reusable confirmation dialog component
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
  isDarkMode = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirm action failed:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const confirmButtonClass = isDangerous
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={handleCancel}
      size="sm"
      className={`${isDarkMode ? 'dark' : ''}`}
    >
      <div className={`py-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className={isDarkMode ? 'dark' : ''}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className={confirmButtonClass}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </div>
    </Modal>
  );
};

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmDialogOptions | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const open = React.useCallback((dialogOptions: ConfirmDialogOptions) => {
    const wrappedOnConfirm = async () => {
      setIsLoading(true);
      try {
        await dialogOptions.onConfirm();
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    setOptions({
      ...dialogOptions,
      onConfirm: wrappedOnConfirm,
    });
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
    options,
    isLoading,
  };
}
