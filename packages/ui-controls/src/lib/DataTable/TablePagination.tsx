/**
 * Table Pagination Component
 * Pagination controls for DataTable
 */

import React from 'react';
import Button from '../Button/Button';
import './TablePagination.css';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  displayedRange: [number, number];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isDarkMode?: boolean;
  showPageSizeOptions?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Table pagination component with page navigation and size selector
 */
export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  displayedRange,
  onPageChange,
  onPageSizeChange,
  isDarkMode = false,
  showPageSizeOptions = true,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className = '',
}) => {
  const [start, end] = displayedRange;

  return (
    <div className={`table-pagination ${isDarkMode ? 'table-pagination--dark' : ''} ${className}`.trim()}>
      <div className="table-pagination__info">
        <span>
          Showing {start} to {end} of {totalRows}
        </span>
      </div>

      <div className="table-pagination__controls">
        {showPageSizeOptions && (
          <div className="table-pagination__size">
            <label htmlFor="page-size-select">Items per page:</label>
            <select
              id="page-size-select"
              className="table-pagination__select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="table-pagination__buttons">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ← Prev
          </Button>

          <div className="table-pagination__pages">
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
