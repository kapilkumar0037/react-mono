import React from 'react';
import { Button, Modal } from '@react-mono/ui-controls';

interface AdminActionConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmClassName?: string;
  isDarkMode?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AdminActionConfirm: React.FC<AdminActionConfirmProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmClassName = 'bg-red-600 text-white',
  isDarkMode = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-4">
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{message}</p>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} className="bg-gray-600 text-white">
            Cancel
          </Button>
          <Button onClick={onConfirm} className={confirmClassName}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminActionConfirm;
