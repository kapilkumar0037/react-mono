/**
 * DataTable Component Examples
 * Practical usage examples for different scenarios
 */

import React, { useState, useMemo } from 'react';
import { DataTable, useTableState, TablePagination, TableBulkActions, TableColumn } from './index';
import { Badge, Button, Card } from '../index';

// Sample data
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
  lastActive: string;
}

const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2025-01-15',
    lastActive: '2025-01-20',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
    joinDate: '2025-02-01',
    lastActive: '2025-01-19',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Viewer',
    status: 'Inactive',
    joinDate: '2025-01-20',
    lastActive: '2024-12-15',
  },
];

// User columns definition
const USER_COLUMNS: TableColumn<User>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    width: '200px',
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    width: '250px',
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    render: (value) => (
      <Badge
        variant={value === 'Admin' ? 'primary' : value === 'User' ? 'info' : 'secondary'}
      >
        {value}
      </Badge>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <Badge
        variant={
          value === 'Active' ? 'success' : value === 'Suspended' ? 'danger' : 'secondary'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    sortable: true,
  },
  {
    key: 'lastActive',
    label: 'Last Active',
    sortable: true,
  },
];

/**
 * Example 1: Basic Table
 */
export function BasicTableExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
    pageSize: 10,
  });

  return (
    <Card>
      <h3>Basic Table</h3>
      <DataTable columns={USER_COLUMNS} tableState={tableState} striped hover />
      <TablePagination
        currentPage={tableState.currentPage}
        totalPages={tableState.totalPages}
        pageSize={tableState.pageSize}
        totalRows={tableState.totalRows}
        displayedRange={tableState.displayedRange}
        onPageChange={tableState.setCurrentPage}
        onPageSizeChange={tableState.setPageSize}
      />
    </Card>
  );
}

/**
 * Example 2: Table with Filters
 */
export function FilteredTableExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
    initialSortColumn: 'name',
    initialSortOrder: 'asc',
  });

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
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
    <Card>
      <h3>Table with Filters</h3>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          onClick={() => handleStatusFilter('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'Active' ? 'primary' : 'outline'}
          onClick={() => handleStatusFilter('Active')}
        >
          Active
        </Button>
        <Button
          variant={statusFilter === 'Inactive' ? 'primary' : 'outline'}
          onClick={() => handleStatusFilter('Inactive')}
        >
          Inactive
        </Button>
        <Button
          variant={statusFilter === 'Suspended' ? 'primary' : 'outline'}
          onClick={() => handleStatusFilter('Suspended')}
        >
          Suspended
        </Button>
      </div>

      <DataTable columns={USER_COLUMNS} tableState={tableState} striped hover />
      <TablePagination
        currentPage={tableState.currentPage}
        totalPages={tableState.totalPages}
        pageSize={tableState.pageSize}
        totalRows={tableState.totalRows}
        displayedRange={tableState.displayedRange}
        onPageChange={tableState.setCurrentPage}
        onPageSizeChange={tableState.setPageSize}
      />
    </Card>
  );
}

/**
 * Example 3: Table with Selection and Bulk Actions
 */
export function BulkActionsTableExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
  });

  const handleDelete = () => {
    console.log('Delete selected:', tableState.selectedRows);
    tableState.clearSelection();
  };

  const handleExport = () => {
    console.log('Export selected:', tableState.selectedRows);
  };

  const handleRoleChange = (newRole: string) => {
    console.log('Change role to:', newRole, tableState.selectedRows);
    tableState.clearSelection();
  };

  const bulkActions = [
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger' as const,
      icon: '🗑️',
      onClick: handleDelete,
    },
    {
      id: 'export',
      label: 'Export',
      icon: '📥',
      onClick: handleExport,
    },
    {
      id: 'promote',
      label: 'Promote to Admin',
      onClick: () => handleRoleChange('Admin'),
    },
  ];

  return (
    <Card>
      <h3>Table with Selection and Bulk Actions</h3>

      <TableBulkActions
        isVisible={tableState.selectedCount > 0}
        selectedCount={tableState.selectedCount}
        totalCount={tableState.totalRows}
        actions={bulkActions}
        onClearSelection={tableState.clearSelection}
      />

      <DataTable columns={USER_COLUMNS} tableState={tableState} striped hover />
      <TablePagination
        currentPage={tableState.currentPage}
        totalPages={tableState.totalPages}
        pageSize={tableState.pageSize}
        totalRows={tableState.totalRows}
        displayedRange={tableState.displayedRange}
        onPageChange={tableState.setCurrentPage}
        onPageSizeChange={tableState.setPageSize}
      />
    </Card>
  );
}

/**
 * Example 4: Table with Row Actions
 */
export function RowActionsTableExample() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (user: User) => {
    console.log('Delete user:', user.id);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  const columnsWithActions: TableColumn<User>[] = [
    ...USER_COLUMNS,
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(user)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: columnsWithActions,
  });

  return (
    <Card>
      <h3>Table with Row Actions</h3>

      <DataTable
        columns={columnsWithActions}
        tableState={tableState}
        striped
        hover
        onRowClick={handleRowClick}
        rowClassName={(row) => (selectedUser?.id === row.id ? 'selected' : '')}
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

      {selectedUser && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h4>Selected User: {selectedUser.name}</h4>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
        </div>
      )}
    </Card>
  );
}

/**
 * Example 5: Compact Responsive Table
 */
export function ResponsiveTableExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
    pageSize: 5,
  });

  return (
    <Card>
      <h3>Responsive Mobile Table</h3>
      <DataTable
        columns={USER_COLUMNS}
        tableState={tableState}
        compact={true}
        responsive={true}
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
    </Card>
  );
}

/**
 * Example 6: Dark Mode Table
 */
export function DarkModeTableExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
  });

  return (
    <Card
      style={{
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        padding: '1rem',
      }}
    >
      <h3>Dark Mode Table</h3>
      <DataTable
        columns={USER_COLUMNS}
        tableState={tableState}
        isDarkMode={true}
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
        isDarkMode={true}
      />
    </Card>
  );
}

/**
 * Example 7: Empty State
 */
export function EmptyStateExample() {
  const tableState = useTableState({
    data: [],
    columns: USER_COLUMNS,
  });

  return (
    <Card>
      <h3>Empty State</h3>
      <DataTable
        columns={USER_COLUMNS}
        tableState={tableState}
        emptyMessage="No users found. Try adjusting your filters."
      />
    </Card>
  );
}

/**
 * Example 8: Loading State
 */
export function LoadingStateExample() {
  const tableState = useTableState({
    data: SAMPLE_USERS,
    columns: USER_COLUMNS,
  });

  return (
    <Card>
      <h3>Loading State</h3>
      <DataTable
        columns={USER_COLUMNS}
        tableState={tableState}
        isLoading={true}
        loadingMessage="Loading users..."
      />
    </Card>
  );
}

/**
 * All Examples Component
 */
export function DataTableExamples() {
  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
      <BasicTableExample />
      <FilteredTableExample />
      <BulkActionsTableExample />
      <RowActionsTableExample />
      <ResponsiveTableExample />
      <DarkModeTableExample />
      <EmptyStateExample />
      <LoadingStateExample />
    </div>
  );
}

export default DataTableExamples;
