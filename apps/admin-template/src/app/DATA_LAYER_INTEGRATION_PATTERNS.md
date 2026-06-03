# Data Layer Integration Patterns

This guide shows practical patterns for integrating the new Shared Data Layer with existing admin pages.

## Pattern 1: Parallel State (Safest for Existing Code)

Run both localStorage-based state and data layer hooks in parallel. Good for incremental migration.

```typescript
import { useUsers } from '@/services/userService';

function Users() {
  // Keep existing localStorage state
  const [users, setUsers] = useState(() => readStoredUsers());
  
  // Add data layer query in parallel
  const { data: apiUsers, isLoading: apiLoading } = useUsers({
    enabled: false, // Start disabled
  });
  
  // Sync data layer to localStorage on demand
  const syncFromAPI = () => {
    if (apiUsers) {
      setUsers(apiUsers);
      persistUsers(apiUsers);
    }
  };

  return (
    <>
      {/* Existing UI */}
      <Button onClick={syncFromAPI}>
        Sync from API
      </Button>
    </>
  );
}
```

## Pattern 2: Hybrid State (Recommended for Most Pages)

Use data layer for fetching, localStorage for offline cache and preferences.

```typescript
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/services/userService';
import { useGlobalToast } from '@/hooks';

function Users({ isDarkMode, currentRole, currentUserEmail }) {
  const { addToast } = useGlobalToast();
  
  // Fetch data from API with caching
  const { data: users = [], isLoading, error, refetch } = useUsers({
    staleTime: 60000, // Fresh for 1 minute
    cache: true,
  });

  // Mutations
  const [createUser, createState] = useCreateUser({
    onSuccess: () => {
      addToast({ type: 'success', message: 'User created!' });
      refetch(); // Refresh list
    },
  });

  const [updateUser, updateState] = useUpdateUser({
    onSuccess: () => {
      addToast({ type: 'success', message: 'User updated!' });
      refetch();
    },
  });

  const [deleteUser, deleteState] = useDeleteUser({
    onSuccess: () => {
      addToast({ type: 'success', message: 'User deleted!' });
      refetch();
    },
  });

  // Local state for UI only (filters, pagination, modals)
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter in memory (same as before)
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (filterRole === 'all' || user.role === filterRole) &&
      (filterStatus === 'all' || user.status === filterStatus)
    );
  }, [users, filterRole, filterStatus]);

  // Pagination in memory
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveUser = async (formData) => {
    try {
      if (isEditMode) {
        await updateUser({
          id: editingUserId,
          ...formData,
        });
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to save user' });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser({ id: userId });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to delete user' });
    }
  };

  if (error) return <ErrorAlert error={error} />;

  return (
    <div>
      <Header 
        loading={isLoading}
        onRefresh={refetch}
      />
      {isLoading && !users.length ? (
        <Spinner />
      ) : users.length === 0 ? (
        <EmptyState title="No users" />
      ) : (
        <>
          <UserTable 
            users={paginatedUsers}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteUser}
            deleting={deleteState.isLoading}
          />
          <Pagination {...} />
        </>
      )}
      <UserModal
        isOpen={isModalOpen}
        isLoading={createState.isLoading || updateState.isLoading}
        onSave={handleSaveUser}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

## Pattern 3: Real-time Sync (Advanced)

Combine data layer with real-time subscription for live updates.

```typescript
import { useUsers } from '@/services/userService';
import { useRealtimeSync } from '@/hooks';

function UsersWithRealtime() {
  const { data: users = [], refetch } = useUsers();
  const { syncStatus, changes } = useRealtimeSync('User');

  // Refetch when real-time changes occur
  useEffect(() => {
    if (changes.length > 0) {
      refetch();
    }
  }, [changes, refetch]);

  return (
    <>
      <RealtimeStatusIndicator status={syncStatus} />
      <UserTable users={users} />
    </>
  );
}
```

## Pattern 4: Background Refresh (Polling)

Keep data fresh with automatic periodic refetch.

```typescript
import { useUsers } from '@/services/userService';

function UsersWithPolling() {
  const queryState = useUsers();

  // Refetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryState.refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [queryState]);

  return <UserTable users={queryState.data} />;
}
```

## Pattern 5: Filters with Query Parameters

Keep filters in URL for shareability while using data layer.

```typescript
import { useUsers } from '@/services/userService';
import { useSearchParams } from 'react-router-dom';

function UsersWithQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filterRole = searchParams.get('role') ?? 'all';
  const filterStatus = searchParams.get('status') ?? 'all';

  // Fetch all users, filter in memory
  const { data: users = [] } = useUsers();

  // Or, pass filter to API
  const { data: filteredUsers = [] } = useUsers({
    params: {
      role: filterRole !== 'all' ? filterRole : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
    },
  });

  const handleFilterChange = (role, status) => {
    const params = new URLSearchParams();
    if (role !== 'all') params.set('role', role);
    if (status !== 'all') params.set('status', status);
    setSearchParams(params);
  };

  return (
    <>
      <FilterBar
        onRoleChange={(role) => handleFilterChange(role, filterStatus)}
        onStatusChange={(status) => handleFilterChange(filterRole, status)}
      />
      <UserTable users={filteredUsers} />
    </>
  );
}
```

## Gradual Migration Checklist

### Phase 1: Read Operations
- [ ] Replace `useState()` + `useEffect()` fetch with `useQuery()`
- [ ] Keep existing filters, pagination, search in local state
- [ ] Use `refetch()` instead of manual state updates
- [ ] Verify loading and error states work

### Phase 2: Write Operations
- [ ] Replace form submission fetch with `useMutation()`
- [ ] Connect success/error callbacks to existing toasts
- [ ] Verify optimistic updates work (if needed)
- [ ] Test error rollback scenarios

### Phase 3: Cache Management
- [ ] Verify cache invalidation after mutations
- [ ] Test refetch after add/edit/delete
- [ ] Configure appropriate cacheTTL per page
- [ ] Test offline scenarios

### Phase 4: Advanced Features
- [ ] Add real-time subscriptions
- [ ] Implement background polling
- [ ] Add query parameter filters
- [ ] Profile performance improvements

## Common Integration Issues

### Issue: Data updates but UI doesn't refresh

**Cause:** Not calling `refetch()` after mutation

**Solution:**
```typescript
const [createUser] = useCreateUser({
  onSuccess: () => {
    queryState.refetch(); // ← Add this
  },
});
```

### Issue: Cache not invalidating properly

**Cause:** Custom invalidation not matching cache keys

**Solution:**
```typescript
import { queryCache } from '@/services';

const [deleteUser] = useDeleteUser({
  onSuccess: () => {
    // Manually invalidate after custom operations
    queryCache.invalidateEntity('users');
  },
});
```

### Issue: Multiple pages sharing same cache

**Cause:** Shared cache key across different filters

**Solution:**
```typescript
// Include filter in the path/cache key
const { data: activeUsers } = useUsers({
  params: { status: 'active' },
  // Cache key will be different from inactive users
});
```

### Issue: Stale data in nested relationships

**Cause:** Parent data cached but children not invalidated

**Solution:**
```typescript
// Manually invalidate related caches
const [updateUser] = useUpdateUser({
  onSuccess: () => {
    queryCache.invalidatePattern(/^users:/);
    queryCache.invalidatePattern(/^activity-log:/);
  },
});
```

## Performance Optimization Examples

### Avoid Over-Fetching

```typescript
// ❌ Bad: Fetches all users for single display
function UserPreview({ userId }) {
  const { data: users } = useUsers();
  const user = users?.find(u => u.id === userId);
  return <UserCard user={user} />;
}

// ✅ Good: Fetches only needed user
function UserPreview({ userId }) {
  const { data: user } = useUserById(userId);
  return <UserCard user={user} />;
}
```

### Prevent Unnecessary Refetches

```typescript
// ❌ Bad: Creates new options object each render
function Users() {
  const state = useUsers({
    staleTime: 60000,
  }); // ← New object each render!
  return <Table data={state.data} />;
}

// ✅ Good: Memoize options
const QUERY_OPTIONS = { staleTime: 60000 };
function Users() {
  const state = useUsers(QUERY_OPTIONS);
  return <Table data={state.data} />;
}
```

### Lazy Load Large Lists

```typescript
import { usePaginatedUsers } from '@/services/userService';

function UsersList() {
  const {
    data: users,
    page,
    pageSize,
    totalPages,
    goToPage,
  } = usePaginatedUsers(1, 10); // Load 10 items per page

  return (
    <>
      <UserTable users={users} />
      <Pagination
        current={page}
        total={totalPages}
        onGoTo={goToPage}
      />
    </>
  );
}
```

## Testing with Data Layer

### Mock the Service

```typescript
import { vi } from 'vitest';
import { userService } from '@/services';

beforeEach(() => {
  vi.spyOn(userService.hooks, 'useUsers').mockReturnValue({
    data: [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isStale: false,
  });
});

it('renders users from service', () => {
  render(<Users />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

### Test Mutations

```typescript
it('creates user on form submit', async () => {
  const createMock = vi.fn().mockResolvedValue({ id: '2', name: 'Bob' });
  
  vi.spyOn(userService.hooks, 'useCreateUser').mockReturnValue([
    createMock,
    { data: null, isLoading: false, isError: false, error: null, reset: vi.fn() },
  ]);

  render(<CreateUserForm />);
  
  await userEvent.type(screen.getByLabelText('Name'), 'Bob');
  await userEvent.click(screen.getByRole('button', { name: /create/i }));

  expect(createMock).toHaveBeenCalledWith({ name: 'Bob' });
});
```

## Next Steps

1. Choose a page to migrate (Users, Activity Log, Reports)
2. Use Pattern 2 (Hybrid State) as starting point
3. Gradually move more logic to the data layer
4. Test thoroughly with existing features (RBAC, audit, etc)
5. Document any custom patterns needed for your app
