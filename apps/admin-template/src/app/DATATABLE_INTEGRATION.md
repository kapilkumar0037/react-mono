# DataTable + Data Layer Integration Guide

Quick guide showing how to use the new DataTable component with the Shared Data Layer.

## Basic Integration

```typescript
import { DataTable, useTableState, TablePagination } from '@react-mono/ui-controls';
import { useUsers } from '@/services/userService';

function UsersPage() {
  // Fetch data from API
  const { data: users = [], isLoading, error } = useUsers();

  // Setup table state
  const tableState = useTableState({
    data: users,
    columns: USER_COLUMNS,
    pageSize: 10,
  });

  if (error) return <ErrorAlert error={error} />;

  return (
    <>
      <h1>Users</h1>
      
      <DataTable
        columns={USER_COLUMNS}
        tableState={tableState}
        isLoading={isLoading}
        striped
        hover
      />
      
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

## With Bulk Actions

```typescript
import { useDeleteUser } from '@/services/userService';
import { useGlobalToast } from '@/hooks';

function UsersTable() {
  const { data: users = [] } = useUsers();
  const { addToast } = useGlobalToast();
  const [deleteUsers] = useDeleteUser();

  const tableState = useTableState({
    data: users,
    columns: USER_COLUMNS,
  });

  const handleBulkDelete = async () => {
    try {
      // Delete all selected users
      for (const userId of tableState.selectedRows) {
        await deleteUsers({ id: userId });
      }
      addToast({ type: 'success', message: 'Users deleted' });
      tableState.clearSelection();
    } catch (error) {
      addToast({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <>
      <TableBulkActions
        isVisible={tableState.selectedCount > 0}
        selectedCount={tableState.selectedCount}
        totalCount={tableState.totalRows}
        actions={[
          {
            id: 'delete',
            label: 'Delete Selected',
            variant: 'danger',
            onClick: handleBulkDelete,
          },
        ]}
        onClearSelection={tableState.clearSelection}
      />
      
      <DataTable columns={USER_COLUMNS} tableState={tableState} />
      <TablePagination {...tableState} />
    </>
  );
}
```

## With Filters

```typescript
function FilteredUsersTable() {
  // Support API-level filtering if available
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: users = [] } = useUsers({
    params: statusFilter !== 'all' ? { status: statusFilter } : {},
  });

  const tableState = useTableState({
    data: users,
    columns: USER_COLUMNS,
  });

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    tableState.setCurrentPage(1);
  };

  return (
    <>
      <div className="filter-bar">
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'Active' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('Active')}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === 'Inactive' ? 'primary' : 'outline'}
          onClick={() => handleFilterChange('Inactive')}
        >
          Inactive
        </Button>
      </div>

      <DataTable columns={USER_COLUMNS} tableState={tableState} />
      <TablePagination {...tableState} />
    </>
  );
}
```

## With Row Actions

```typescript
import { useDeleteUser, useUpdateUser } from '@/services/userService';

function UsersTableWithActions() {
  const [updateUser] = useUpdateUser();
  const [deleteUser] = useDeleteUser();

  const handleStatusChange = async (user: User, newStatus: string) => {
    await updateUser({ id: user.id, status: newStatus });
  };

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(`Delete ${user.name}?`);
    if (confirmed) {
      await deleteUser({ id: user.id });
    }
  };

  const columnsWithActions = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user: User) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            size="sm"
            onClick={() => handleStatusChange(user, 'active')}
          >
            Activate
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(user)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const { data: users = [] } = useUsers();
  const tableState = useTableState({
    data: users,
    columns: columnsWithActions,
  });

  return (
    <>
      <DataTable columns={columnsWithActions} tableState={tableState} />
      <TablePagination {...tableState} />
    </>
  );
}
```

## With Pagination from API

If your API supports pagination parameters:

```typescript
import { usePaginatedUsers } from '@/services/userService';

function PaginatedUsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch only current page from API
  const { data: { items: users = [], total } = {} } = usePaginatedUsers(page, pageSize);

  // Create minimal table state (no need for client-side pagination)
  const tableState = useTableState({
    data: users,
    columns: USER_COLUMNS,
    pageSize: pageSize,
  });

  return (
    <>
      <DataTable columns={USER_COLUMNS} tableState={tableState} />
      
      <TablePagination
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
        pageSize={pageSize}
        totalRows={total}
        displayedRange={[
          (page - 1) * pageSize + 1,
          Math.min(page * pageSize, total),
        ]}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />
    </>
  );
}
```

## Complete Example: Users Management Page

```typescript
import { DataTable, useTableState, TablePagination, TableBulkActions } from '@react-mono/ui-controls';
import { useUsers, useDeleteUser, useUpdateUser } from '@/services/userService';
import { useGlobalToast } from '@/hooks';
import { useConfirmDialog, ConfirmDialog } from '@/components';

function UsersManagementPage() {
  const { data: users = [], isLoading, refetch } = useUsers();
  const { addToast } = useGlobalToast();
  const [deleteUser] = useDeleteUser({ onSuccess: refetch });
  const [updateUser] = useUpdateUser({ onSuccess: refetch });
  const confirmDelete = useConfirmDialog();

  const tableState = useTableState({
    data: users,
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: (value) => <Badge>{value}</Badge>,
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
        render: (_, user: User) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              size="sm"
              onClick={() => {
                // Open edit modal
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                confirmDelete.open({
                  title: 'Delete User',
                  message: `Delete ${user.name}?`,
                  isDangerous: true,
                  onConfirm: async () => {
                    try {
                      await deleteUser({ id: user.id });
                      addToast({ type: 'success', message: 'User deleted' });
                    } catch (error) {
                      addToast({ type: 'error', message: 'Delete failed' });
                    }
                  },
                });
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
  });

  const handleBulkDelete = async () => {
    confirmDelete.open({
      title: 'Delete Multiple Users',
      message: `Delete ${tableState.selectedCount} users?`,
      isDangerous: true,
      onConfirm: async () => {
        try {
          for (const userId of tableState.selectedRows) {
            await deleteUser({ id: userId });
          }
          addToast({ 
            type: 'success', 
            message: `${tableState.selectedCount} users deleted` 
          });
          tableState.clearSelection();
          refetch();
        } catch (error) {
          addToast({ type: 'error', message: 'Delete failed' });
        }
      },
    });
  };

  return (
    <div>
      <h1>Users Management</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <TableBulkActions
            isVisible={tableState.selectedCount > 0}
            selectedCount={tableState.selectedCount}
            totalCount={tableState.totalRows}
            actions={[
              {
                id: 'delete',
                label: `Delete (${tableState.selectedCount})`,
                variant: 'danger',
                onClick: handleBulkDelete,
              },
            ]}
            onClearSelection={tableState.clearSelection}
          />

          <DataTable
            columns={tableState.columns}
            tableState={tableState}
            striped
            hover
          />

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
      )}

      <ConfirmDialog {...confirmDelete} />
    </div>
  );
}
```

## Key Integration Points

### With Data Layer
- ✅ Works with `useUsers()`, `usePaginatedUsers()`, etc.
- ✅ Automatic refetch after mutations
- ✅ Client-side or API-level pagination
- ✅ Caching handled by data layer

### With Global Toast
- ✅ Show success/error feedback
- ✅ Display bulk action results
- ✅ Notify users of changes

### With Confirm Dialog
- ✅ Dangerous actions need confirmation
- ✅ Bulk delete confirmations
- ✅ Reversible operations

### With RBAC
```typescript
const canDelete = hasPermission(currentRole, 'users.delete', definitions);

// Hide delete button if no permission
{canDelete && (
  <Button onClick={() => handleDelete(user)}>Delete</Button>
)}
```

### With Audit Log
```typescript
const auditLog = useAuditLog();

const handleDelete = async (user) => {
  await deleteUser({ id: user.id });
  
  auditLog.logAction(
    AuditActionType.USER_DELETED,
    currentUserEmail,
    'User',
    user.id,
    {
      entityName: user.name,
      description: `User ${user.name} deleted`,
    }
  );
};
```

## Performance Tips

1. **Memoize columns**
   ```typescript
   const columns = useMemo(() => [...], []);
   ```

2. **Use API-level pagination** for large datasets
   ```typescript
   const { data } = usePaginatedUsers(page, pageSize);
   ```

3. **Refetch after mutations**
   ```typescript
   const [delete_] = useDeleteUser({ 
     onSuccess: () => refetch() 
   });
   ```

4. **Lazy load actions**
   ```typescript
   const [expanded, setExpanded] = useState(null);
   // Only show actions for expanded row
   ```

## Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('integrates with data layer', async () => {
  // Mock useUsers hook
  vi.mocked(useUsers).mockReturnValue({
    data: [{ id: '1', name: 'Alice' }],
    isLoading: false,
  });

  render(<UsersManagementPage />);
  
  expect(screen.getByText('Alice')).toBeInTheDocument();
});

it('handles bulk delete', async () => {
  render(<UsersManagementPage />);
  
  const checkbox = screen.getByRole('checkbox', { name: /select all/i });
  await userEvent.click(checkbox);
  
  const deleteBtn = screen.getByRole('button', { name: /delete/i });
  await userEvent.click(deleteBtn);
  
  expect(useDeleteUser).toHaveBeenCalled();
});
```

## Migration from Old Users Page

### Before (Old Pattern)
```typescript
const [users, setUsers] = useState([]);
const [sortBy, setSortBy] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');
const [page, setPage] = useState(1);

// Manual sorting, filtering, pagination logic
```

### After (New Pattern)
```typescript
const { data: users } = useUsers();
const tableState = useTableState({ data: users, columns });

// Sorting, filtering, pagination all built-in
```

## Ready to Use!

Start integrating DataTable into:
1. ✅ Users page
2. Activity Log page
3. Reports page
4. Notifications page
5. Any other data-heavy page

All functionality is plug-and-play with the existing data layer and admin features.
