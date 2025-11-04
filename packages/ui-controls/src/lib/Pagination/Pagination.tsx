import React from 'react';

export interface PaginationProps {
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Current page (1-based)
   */
  currentPage: number;
  /**
   * Number of items per page
   */
  pageSize: number;
  /**
   * Number of pages to show around current page
   */
  siblingCount?: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];
  /**
   * Show first/last page buttons
   */
  showBoundaryButtons?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Show page size selector
   */
  showPageSize?: boolean;
}

const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  pageSize,
  siblingCount = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  showBoundaryButtons = true,
  showPageSize = true,
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers: (number | 'dots')[] = [];
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // total numbers + two dots blocks

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'dots', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'dots', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'dots', ...middleRange, 'dots', totalPages];
    }

    return [];
  };

  const pageNumbers = getPageNumbers();

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    onPageSizeChange?.(newPageSize);
  };

  const baseButtonClasses = `
    relative inline-flex items-center px-3 py-2 text-sm font-medium
    focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const activeButtonClasses = `
    bg-primary text-white hover:bg-primary/90
    focus:ring-primary
  `;

  const inactiveButtonClasses = `
    bg-white text-gray-500 hover:bg-gray-50
    focus:ring-primary
  `;

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      {showPageSize && (
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            Show
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="block w-full rounded-md border-gray-300 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">items</span>
        </div>
      )}

      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* First page button */}
        {showBoundaryButtons && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`rounded-l-md border ${baseButtonClasses} ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : inactiveButtonClasses
            }`}
            aria-label="Go to first page"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border ${baseButtonClasses} ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : inactiveButtonClasses
          }`}
          aria-label="Previous page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'dots') {
            return (
              <span
                key={`dots-${index}`}
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 border"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`border ${baseButtonClasses} ${
                pageNumber === currentPage ? activeButtonClasses : inactiveButtonClasses
              }`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border ${baseButtonClasses} ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : inactiveButtonClasses
          }`}
          aria-label="Next page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Last page button */}
        {showBoundaryButtons && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`rounded-r-md border ${baseButtonClasses} ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : inactiveButtonClasses
            }`}
            aria-label="Go to last page"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </nav>

      <div className="text-sm text-gray-700">
        <span>
          Showing{' '}
          <span className="font-medium">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </span>
      </div>
    </div>
  );
};

export default Pagination;