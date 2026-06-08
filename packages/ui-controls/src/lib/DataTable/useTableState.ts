/**
 * Table State Management Hook
 * Manages sorting, filtering, selection, and pagination states for data tables
 */

import { useState, useCallback, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc' | null;

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  headerRender?: (column: TableColumn<T>) => React.ReactNode;
  className?: string;
}

export interface TableFilter {
  column: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'between' | 'gt' | 'lt';
}

export interface UseTableStateOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId?: (row: T) => string | number;
  initialSortColumn?: keyof T | string;
  initialSortOrder?: SortOrder;
  pageSize?: number;
}

export interface UseTableStateReturn<T> {
  // Sorting
  sortColumn: (keyof T | string) | null;
  sortOrder: SortOrder;
  setSortColumn: (column: keyof T | string | null) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (column: keyof T | string) => void;

  // Filtering
  filters: TableFilter[];
  addFilter: (filter: TableFilter) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  setFilters: (filters: TableFilter[]) => void;

  // Selection
  selectedRows: Set<string | number>;
  toggleRowSelection: (rowId: string | number) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;
  isRowSelected: (rowId: string | number) => boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  selectedCount: number;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalRows: number;

  // Computed data
  filteredData: T[];
  sortedData: T[];
  paginatedData: T[];
  displayedRange: [number, number]; // [start, end] for "1-10 of 100"

  // Utilities
  getRowId: (row: T) => string | number;
  resetTable: () => void;
}

/**
 * Hook for managing table state (sorting, filtering, selection, pagination)
 */
export function useTableState<T extends Record<string, any>>({
  data,
  columns,
  getRowId = (row, index) => (row.id || index),
  initialSortColumn,
  initialSortOrder = null,
  pageSize: initialPageSize = 10,
}: UseTableStateOptions<T>): UseTableStateReturn<T> {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(initialSortColumn || null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  // Filtering state
  const [filters, setFilters] = useState<TableFilter[]>([]);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Row ID resolver
  const resolveRowId = useCallback(
    (row: T, index: number): string | number => {
      if (typeof getRowId === 'function') {
        return getRowId(row);
      }
      return row.id || index;
    },
    [getRowId]
  );

  // Apply filters
  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter((row) => {
      return filters.every((filter) => {
        const value = (row as any)[filter.column];
        const filterValue = filter.value;

        switch (filter.operator || 'equals') {
          case 'equals':
            return value === filterValue;
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'gt':
            return value > filterValue;
          case 'lt':
            return value < filterValue;
          case 'between':
            return value >= filterValue.min && value <= filterValue.max;
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortOrder) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortOrder]);

  // Calculate pagination
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / pageSize) || 1;

  // Validate and clamp current page
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  // Apply pagination
  const paginatedData = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, validPage, pageSize]);

  // Selection helpers
  const toggleRowSelection = useCallback((rowId: string | number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const toggleAllSelection = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(paginatedData.map((row, index) => resolveRowId(row, index)));
      setSelectedRows(allIds);
    }
  }, [paginatedData, selectedRows, resolveRowId]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isRowSelected = useCallback(
    (rowId: string | number) => selectedRows.has(rowId),
    [selectedRows]
  );

  const isAllSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < paginatedData.length;
  const selectedCount = selectedRows.size;

  // Sort toggle
  const toggleSort = useCallback((column: keyof T | string) => {
    setSortColumn((prev) => {
      if (prev === column) {
        // Cycle: asc -> desc -> null
        setSortOrder((prevOrder) => {
          if (prevOrder === 'asc') return 'desc';
          if (prevOrder === 'desc') return null;
          return 'asc';
        });
        return column;
      } else {
        // New column, start with asc
        setSortOrder('asc');
        return column;
      }
    });
  }, []);

  // Filter helpers
  const addFilter = useCallback((filter: TableFilter) => {
    setFilters((prev) => {
      // Remove existing filter for same column if any
      const filtered = prev.filter((f) => f.column !== filter.column);
      return [...filtered, filter];
    });
    setCurrentPage(1); // Reset to first page
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
    setCurrentPage(1);
  }, []);

  // Display range for "1-10 of 100"
  const displayedRange: [number, number] = [
    totalRows === 0 ? 0 : (validPage - 1) * pageSize + 1,
    Math.min(validPage * pageSize, totalRows),
  ];

  // Reset everything
  const resetTable = useCallback(() => {
    setSortColumn(null);
    setSortOrder(null);
    setFilters([]);
    setSelectedRows(new Set());
    setCurrentPage(1);
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  // Update current page if it becomes invalid
  if (validPage !== currentPage) {
    setCurrentPage(validPage);
  }

  return {
    // Sorting
    sortColumn,
    sortOrder,
    setSortColumn,
    setSortOrder,
    toggleSort,

    // Filtering
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    setFilters,

    // Selection
    selectedRows,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
    selectedCount,

    // Pagination
    currentPage: validPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    totalPages,
    totalRows,

    // Computed data
    filteredData,
    sortedData,
    paginatedData,
    displayedRange,

    // Utilities
    getRowId: resolveRowId,
    resetTable,
  };
}
