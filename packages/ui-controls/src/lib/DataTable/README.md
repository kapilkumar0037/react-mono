# DataTable Component - Complete Guide

The `DataTable` component is a production-ready, reusable table system with built-in support for sorting, filtering, pagination, row selection, and bulk actions.

## Quick Start

```typescript
import { DataTable, useTableState, TablePagination, TableBulkActions } from '@react-mono/ui-controls';

function MyDataTable() {
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  const data = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Active' },
  ];

  const tableState = useTableState({ data, columns });

  return (
    <>
      <TableBulkActions
        isVisible={tableState.selectedCount > 0}
        selectedCount={tableState.selectedCount}
        totalCount={tableState.totalRows}
        actions={[
          {
            id: 'delete',
            label: 'Delete',
            variant: 'danger',
            onClick: () => console.log('Delete action'),
          },
        ]}
        onClearSelection={tableState.clearSelection}
      />
      <DataTable columns={columns} tableState={tableState} />
      <TablePagination
        currentPage={tableState.currentPage}
        totalPages={tableState.totalPages}
        pageSize={tableState.pageSize}
        totalRows={tableState.totalRows}
        displayedRange={tableState.displayedRange}
        onPageChange={tableState.setCurrentPage}
        onPageSizeChange={tableState.setPageSize}
      />
    </>
  );
}
```

## Features

### 1. Sorting

Click column headers to sort. Cycle through: ascending → descending → no sort.

```typescript
const tableState = useTableState({
  data,
  columns,
  initialSortColumn: 'name',
  initialSortOrder: 'asc',
});

// Access sort state
console.log(tableState.sortColumn);  // 'name'
console.log(tableState.sortOrder);   // 'asc'

// Programmatic sorting
tableState.setSortColumn('email');
tableState.setSortOrder('desc');
tableState.toggleSort('name');
```

### 2. Filtering

Add, remove, and manage filters.

```typescript
// Add filter
tableState.addFilter({
  column: 'status',
  value: 'Active',
  operator: 'equals',
});

// Other operators
// 'equals', 'contains', 'startsWith', 'endsWith', 'between', 'gt', 'lt'

tableState.addFilter({
  column: 'email',
  value: '@example.com',
  operator: 'endsWith',
});

// View active filters
console.log(tableState.filters);

// Remove filter by index
tableState.removeFilter(0);

// Clear all filters
tableState.clearFilters();
```

### 3. Row Selection

Select individual or all rows.

```typescript
// Toggle single row
tableState.toggleRowSelection('user-1');

// Select all rows on current page
tableState.toggleAllSelection();

// Check if selected
const isSelected = tableState.isRowSelected('user-1');

// Get selected count
console.log(tableState.selectedCount);
console.log(tableState.isAllSelected);
console.log(tableState.isIndeterminate);

// Clear selection
tableState.clearSelection();
```

### 4. Pagination

Navigate through pages and change page size.

```typescript
tableState.setCurrentPage(2);
tableState.setPageSize(20);

// View pagination info
console.log(tableState.currentPage);
console.log(tableState.totalPages);
console.log(tableState.displayedRange); // [21, 40]
```

### 5. Custom Column Rendering

Customize how data is displayed in cells.

```typescript
const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (value, row, index) => (
      <strong>{value}</strong>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'Active' ? 'success' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (value, row) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" onClick={() => handleEdit(row)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
      </div>
    ),
  },
];
```

### 6. Bulk Actions

Handle multiple rows at once.

```typescript
const actions = [
  {
    id: 'delete',
    label: 'Delete Selected',
    variant: 'danger',
    icon: '🗑️',
    onClick: (selectedRows) => {
      console.log('Delete', selectedRows);
    },
  },
  {
    id: 'export',
    label: 'Export',
    icon: '📥',
    onClick: (selectedRows) => {
      console.log('Export', selectedRows);
    },
  },
];

<TableBulkActions
  isVisible={tableState.selectedCount > 0}
  selectedCount={tableState.selectedCount}
  totalCount={tableState.totalRows}
  actions={actions}
  onClearSelection={tableState.clearSelection}
/>;
```

## Component API

### useTableState

State management hook for table functionality.

```typescript
interface UseTableStateOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId?: (row: T) => string | number;
  initialSortColumn?: keyof T | string;
  initialSortOrder?: SortOrder;
  pageSize?: number;
}

interface UseTableStateReturn<T> {
  // Sorting
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc' | null;
  setSortColumn: (column: string | null) => void;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  toggleSort: (column: string) => void;

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
  displayedRange: [number, number];

  // Utilities
  getRowId: (row: T) => string | number;
  resetTable: () => void;
}
```

### DataTable

Main table component.

```typescript
interface DataTableProps<T> {
  // Required
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

  // Customization
  showSelectAll?: boolean;
  headerClassName?: string;
  cellClassName?: (row: T, column: TableColumn<T>, index: number) => string;

  // Accessibility
  caption?: string;
  ariaLabel?: string;
}
```

### TablePagination

Pagination control component.

```typescript
interface TablePaginationProps {
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
```

### TableBulkActions

Bulk actions toolbar.

```typescript
interface TableBulkActionsProps {
  isVisible: boolean;
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  isDarkMode?: boolean;
  className?: string;
}

interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  onClick: (selectedRows: Set<string | number>) => void;
  disabled?: boolean;
  requiresConfirm?: boolean;
}
```

## Common Patterns

### With Data Layer

```typescript
import { useUsers } from '@/services/userService';
import { DataTable, useTableState, TablePagination } from '@react-mono/ui-controls';

function UsersTable() {
  const { data: users = [] } = useUsers();
  const tableState = useTableState({
    data: users,
    columns: USER_COLUMNS,
    pageSize: 10,
  });

  return (
    <>
      <DataTable columns={USER_COLUMNS} tableState={tableState} />
      <TablePagination {...tableState} onPageChange={tableState.setCurrentPage} />
    </>
  );
}
```

### With Filters

```typescript
function FilteredTable() {
  const tableState = useTableState({ data, columns });

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      tableState.clearFilters();
    } else {
      tableState.addFilter({
        column: 'status',
        value: status,
        operator: 'equals',
      });
    }
  };

  return (
    <>
      <FilterBar onStatusChange={handleStatusFilter} />
      <DataTable columns={columns} tableState={tableState} />
      <TablePagination {...tableState} />
    </>
  );
}
```

### With Row Actions

```typescript
function TableWithActions() {
  const tableState = useTableState({ data, columns });

  const handleRowEdit = (row) => {
    console.log('Edit', row);
  };

  const handleRowDelete = (row) => {
    // Show confirm dialog
  };

  const handleRowClick = (row) => {
    handleRowEdit(row);
  };

  return (
    <DataTable
      columns={columns}
      tableState={tableState}
      onRowClick={handleRowClick}
      rowClassName={(row) => row.status === 'inactive' ? 'disabled' : ''}
    />
  );
}
```

### With Dark Mode

```typescript
<DataTable
  columns={columns}
  tableState={tableState}
  isDarkMode={true}
  striped
  hover
/>
<TablePagination
  {...tableState}
  isDarkMode={true}
/>
<TableBulkActions
  {...bulkState}
  isDarkMode={true}
/>
```

### Responsive Mobile Table

```typescript
<DataTable
  columns={columns}
  tableState={tableState}
  responsive={true}
  compact={true}
/>
```

## Styling

### Default Theme

- Light background with subtle striping
- Blue accent for selection
- Smooth hover effects
- Responsive on mobile

### Dark Mode

```typescript
<DataTable isDarkMode={true} />
<TablePagination isDarkMode={true} />
<TableBulkActions isDarkMode={true} />
```

### CSS Customization

```css
/* Override table colors */
.data-table {
  --dt-border-color: #your-color;
  --dt-hover-bg: #your-color;
  --dt-header-bg: #your-color;
  --dt-selected-bg: #your-color;
}
```

## Accessibility

✅ **Semantic HTML** - Uses `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`

✅ **ARIA Attributes** - `role`, `aria-label`, `aria-selected`, `aria-sort`

✅ **Keyboard Navigation** - Tab through cells, use Space to select rows

✅ **Screen Reader Support** - Descriptive labels and announcement regions

## Performance

The component uses `useMemo` to optimize:
- Filtering expensive operations
- Sorting large datasets
- Pagination slicing

## Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('sorts by column', async () => {
  const { rerender } = render(<DataTable columns={columns} tableState={state} />);
  
  const header = screen.getByRole('columnheader', { name: 'Name' });
  await userEvent.click(header);
  
  // Assert sorted data
  expect(state.sortColumn).toBe('name');
  expect(state.sortOrder).toBe('asc');
});

it('selects rows', async () => {
  render(<DataTable columns={columns} tableState={state} />);
  
  const checkbox = screen.getByRole('checkbox', { name: /select all/i });
  await userEvent.click(checkbox);
  
  expect(state.isAllSelected).toBe(true);
});
```

## Migration from Old Table

### Before

```typescript
// Old approach with manual state management
const [sortBy, setSortBy] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');
const [page, setPage] = useState(1);
const sorted = data.sort(compareFn);
const paginated = sorted.slice((page - 1) * 10, page * 10);
```

### After

```typescript
// New approach with useTableState
const tableState = useTableState({ data, columns });
// All sorting, filtering, pagination handled automatically
```

## Best Practices

1. **Memoize columns** to prevent recreation
   ```typescript
   const columns = useMemo(() => [...], []);
   ```

2. **Use data layer** for API-driven tables
   ```typescript
   const { data } = useUsers();
   const state = useTableState({ data, columns });
   ```

3. **Handle pagination before mutations**
   ```typescript
   // Reset to page 1 after adding/deleting
   tableState.setCurrentPage(1);
   ```

4. **Combine with global toasts** for actions
   ```typescript
   const { addToast } = useGlobalToast();
   ```

5. **Test edge cases**
   - Empty data
   - Single page
   - Single row
   - No selection allowed

## Examples

See [DataTable.examples.tsx](./DataTable.examples.tsx) for complete working examples:
- Basic table
- Filtered table
- Table with bulk actions
- Table with row actions
- Responsive table
- Dark mode table
- Table with API data
