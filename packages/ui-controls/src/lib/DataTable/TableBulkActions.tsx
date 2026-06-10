/**
 * Table Bulk Actions Toolbar
 * Shows actions available for selected rows
 */

import React from 'react';
import Button from '../Button/Button';
import './TableBulkActions.css';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  onClick: (selectedRows: Set<string | number>) => void;
  disabled?: boolean;
  requiresConfirm?: boolean;
}

export interface TableBulkActionsProps {
  isVisible: boolean;
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  isDarkMode?: boolean;
  className?: string;
}

/**
 * Toolbar showing bulk actions for selected rows
 */
export const TableBulkActions: React.FC<TableBulkActionsProps> = ({
  isVisible,
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  isDarkMode = false,
  className = '',
}) => {
  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className={`table-bulk-actions ${isDarkMode ? 'table-bulk-actions--dark' : ''} ${className}`.trim()}>
      <div className="table-bulk-actions__info">
        <strong>{selectedCount}</strong> of <strong>{totalCount}</strong> selected
        <Button
          variant="link"
          size="sm"
          onClick={onClearSelection}
          className="table-bulk-actions__clear"
        >
          Clear selection
        </Button>
      </div>

      <div className="table-bulk-actions__buttons">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            size="sm"
            disabled={action.disabled}
            onClick={() => action.onClick(new Set())}
            title={action.requiresConfirm ? 'This action requires confirmation' : ''}
          >
            {action.icon && <span className="table-bulk-actions__icon">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TableBulkActions;
