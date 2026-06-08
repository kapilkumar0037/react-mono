/**
 * DataTable Component
 * Reusable table component with sorting, filtering, selection, and pagination
 */

import React, { useMemo } from 'react';
import { Checkbox } from '../checkbox/Checkbox';
import { Spinner } from '../Spinner/Spinner';
import './DataTable.css';
import { TableColumn, UseTableStateReturn } from './useTableState';

export interface DataTableProps<T extends Record<string, any>> {
  // Data and columns
  columns: TableColumn<T>[];
  tableState: UseTableStateReturn<T>;

  // UI customization
  isDarkMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  responsive?: boolean;

  // Loading and empty states
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;

  // Row actions
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;

  // Header customization
  showSelectAll?: boolean;
  headerClassName?: string;

  // Cell customization
  cellClassName?: (row: T, column: TableColumn<T>, index: number) => string;

  // Accessibility
  caption?: string;
  ariaLabel?: string;
}

/**
 * Main DataTable component
 */
export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      columns,
      tableState,
      isDarkMode = false,
      className = '',
      style,
      striped = true,
      hover = true,
      bordered = false,
      compact = false,
      responsive = true,
      isLoading = false,
      emptyMessage = 'No data available',
      loadingMessage = 'Loading...',
      onRowClick,
      rowClassName,
      showSelectAll = true,
      headerClassName = '',
      cellClassName,
      caption,
      ariaLabel,
    },
    ref
  ) => {
    const { paginatedData, getRowId, toggleRowSelection, isRowSelected } = tableState;

    // Determine if we should show checkbox column
    const hasCheckbox = showSelectAll || tableState.selectedRows.size > 0;

    // Build table classes
    const tableClasses = [
      'data-table',
      isDarkMode && 'data-table--dark',
      striped && 'data-table--striped',
      hover && 'data-table--hover',
      bordered && 'data-table--bordered',
      compact && 'data-table--compact',
      responsive && 'data-table--responsive',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Loading state
    if (isLoading) {
      return (
        <div className="data-table__loading">
          <Spinner />
          <p>{loadingMessage}</p>
        </div>
      );
    }

    // Empty state
    if (paginatedData.length === 0) {
      return (
        <div className={`data-table__empty ${isDarkMode ? 'data-table__empty--dark' : ''}`}>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={`data-table-wrapper ${responsive ? 'data-table-wrapper--responsive' : ''}`}>
        <table
          ref={ref}
          className={tableClasses}
          style={style}
          aria-label={ariaLabel || 'Data table'}
          role="table"
        >
          {caption && <caption>{caption}</caption>}

          {/* Header */}
          <thead className="data-table__head">
            <tr className={`data-table__row data-table__row--header ${headerClassName}`.trim()}>
              {hasCheckbox && (
                <th className="data-table__cell data-table__cell--checkbox">
                  <Checkbox
                    checked={tableState.isAllSelected}
                    indeterminate={tableState.isIndeterminate}
                    onChange={tableState.toggleAllSelection}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`data-table__cell data-table__cell--header ${
                    column.sortable ? 'data-table__cell--sortable' : ''
                  } ${column.className || ''}`.trim()}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && tableState.toggleSort(column.key)}
                  role="columnheader"
                  aria-sort={
                    tableState.sortColumn === column.key
                      ? tableState.sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <div className="data-table__header-content">
                    {column.headerRender ? column.headerRender(column) : column.label}
                    {column.sortable && tableState.sortColumn === column.key && (
                      <span className="data-table__sort-indicator">
                        {tableState.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="data-table__body">
            {paginatedData.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = isRowSelected(rowId);
              const rowCss = rowClassName ? rowClassName(row, rowIndex) : '';

              return (
                <tr
                  key={String(rowId)}
                  className={`data-table__row ${isSelected ? 'data-table__row--selected' : ''} ${rowCss}`.trim()}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  role="row"
                  aria-selected={isSelected}
                >
                  {hasCheckbox && (
                    <td className="data-table__cell data-table__cell--checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRowSelection(rowId)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${String(rowId)}-${String(column.key)}`}
                      className={`data-table__cell ${column.className || ''} ${
                        cellClassName ? cellClassName(row, column, rowIndex) : ''
                      }`.trim()}
                      role="gridcell"
                    >
                      {column.render
                        ? column.render((row as any)[column.key], row, rowIndex)
                        : (row as any)[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';

export default DataTable;
