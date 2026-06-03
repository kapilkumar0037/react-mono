# Shared Data Layer - Architecture & Usage Guide

## Overview

The Shared Data Layer provides a unified API for data fetching, caching, and mutations across the admin dashboard. It replaces ad-hoc API calls with a structured, type-safe approach that handles caching, retries, loading states, and error handling automatically.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                   React Components                      │
├─────────────────────────────────────────────────────────┤
│    useQuery | useMutation | userService hooks           │
├─────────────────────────────────────────────────────────┤
│              Service Layer (userService, etc)           │
├─────────────────────────────────────────────────────────┤
│         Hooks Layer (useQuery, useMutation)             │
├─────────────────────────────────────────────────────────┤
│              API Client (apiClient)                     │
├─────────────────────────────────────────────────────────┤
│           Query Cache (queryCache)                      │
├─────────────────────────────────────────────────────────┤
│              HTTP Layer (Fetch API)                     │
└─────────────────────────────────────────────────────────┘
```

## Core Classes & Functions

### 1. ApiClient (`services/apiClient.ts`)

The core HTTP client with built-in caching, retries, and error handling.

**Features:**
- Automatic retry logic with exponential backoff (408, 429, 5xx errors)
- Request/response caching
- Query parameter handling
- Mock data support for development
- Timeout and error handling

**Methods:**
```typescript
apiClient.get<T>(path, options?)      // GET request
apiClient.post<T>(path, data, options?)    // POST request
apiClient.put<T>(path, data, options?)     // PUT request
apiClient.patch<T>(path, data, options?)   // PATCH request
apiClient.delete<T>(path, options?)   // DELETE request
apiClient.request<T>(method, path, options?)  // Generic request
```

**Example:**
```typescript
import { apiClient } from '@/services';

// Simple GET
const users = await apiClient.get('/users');

// GET with parameters
const activeUsers = await apiClient.get('/users', {
  params: { status: 'active', role: 'Admin' },
});

// POST with caching control
const newUser = await apiClient.post('/users', newUserData, {
  cache: false,
  onSuccess: () => console.log('User created!'),
});
```

### 2. QueryCache (`services/queryCache.ts`)

Handles caching with TTL, invalidation patterns, and subscription-based updates.

**Methods:**
```typescript
queryCache.get<T>(key)              // Retrieve from cache
queryCache.set<T>(key, data, ttl)   // Store in cache
queryCache.delete(key)              // Remove entry
queryCache.clear()                  // Clear entire cache
queryCache.invalidateByPattern(pattern)  // Invalidate by regex
queryCache.invalidateEntity(type, id?)   // Invalidate entity cache
queryCache.subscribe(key, callback)      // Watch cache changes
```

**Example:**
```typescript
import { queryCache } from '@/services';

// Cache a value for 5 minutes
queryCache.set('users:list', users, 5 * 60 * 1000);

// Invalidate all user-related cache
queryCache.invalidateByPattern('users:');

// Subscribe to cache changes
const unsubscribe = queryCache.subscribe('users:1', () => {
  console.log('User 1 data changed!');
});
```

## React Hooks

### useQuery (`hooks/useQuery.ts`)

Fetch data with automatic caching, loading, and error states.

**Signature:**
```typescript
const { data, isLoading, isError, error, refetch, isStale } = useQuery<T>(
  method,
  path,
  options?
);
```

**Options:**
```typescript
interface UseQueryOptions {
  enabled?: boolean;      // Enable/disable query
  cache?: boolean;        // Use caching (default: true)
  cacheTTL?: number;      // Cache time-to-live (default: 5min)
  staleTime?: number;     // Time before data is stale
  retries?: number;       // Retry attempts
  retryDelay?: number;    // Delay between retries
  onError?: (error) => void;
  onSuccess?: (data) => void;
}
```

**Example:**
```typescript
import { useQuery } from '@/hooks';

function UsersList() {
  const { data: users, isLoading, error, refetch } = useQuery(
    'GET',
    '/users',
    { staleTime: 60000 }  // Data fresh for 1 minute
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
      <Button onClick={refetch}>Refresh</Button>
    </>
  );
}
```

### usePaginatedQuery

Fetch paginated data with built-in pagination controls.

**Signature:**
```typescript
const {
  data,
  isLoading,
  page,
  pageSize,
  totalPages,
  total,
  goToPage,
  nextPage,
  prevPage,
} = usePaginatedQuery<T>(path, options?);
```

**Example:**
```typescript
function UsersPaginatedTable() {
  const {
    data: users,
    page,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  } = usePaginatedQuery('/users', { enabled: true });

  return (
    <>
      <Table data={users} />
      <Pagination
        current={page}
        total={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
        onGoTo={goToPage}
      />
    </>
  );
}
```

### useMutation

Handle POST, PUT, PATCH, DELETE operations with loading states.

**Signature:**
```typescript
const [mutate, { data, isLoading, isError, error, reset }] = useMutation<T>(
  method,
  path,
  options?
);

// Execute mutation
const result = await mutate(variables);
```

**Options:**
```typescript
interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error) => void;
  onSettled?: () => void;
  optimisticData?: any;      // Optimistic updates
  rollbackOnError?: boolean;  // Auto-rollback on error
}
```

**Example:**
```typescript
import { useMutation } from '@/hooks';

function CreateUserForm() {
  const [createUser, { isLoading, error }] = useMutation(
    'POST',
    '/users',
    {
      onSuccess: (newUser) => {
        toast.success(`User ${newUser.name} created!`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleSubmit = async (formData) => {
    try {
      await createUser(formData);
    } catch (err) {
      // Error already handled by callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </Button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
}
```

### Specialized Mutation Hooks

**useCreateMutation**
```typescript
const [create, state] = useCreateMutation<User>('/users', options);
await create(userData);  // POST /users
```

**useUpdateMutation**
```typescript
const [update, state] = useUpdateMutation<User>(
  (variables) => `/users/${variables.id}`,
  options
);
await update({ id: '123', name: 'New Name' });  // PUT /users/123
```

**useDeleteMutation**
```typescript
const [delete_, state] = useDeleteMutation(
  (variables) => `/users/${variables.id}`,
  options
);
await delete_({ id: '123' });  // DELETE /users/123
```

## Service Layer

Pre-built services that combine API methods and hooks for common entities.

### userService

```typescript
import { userService } from '@/services';

// API methods
const users = await userService.api.getUsers();
const user = await userService.api.getUserById('123');
const newUser = await userService.api.createUser(userData);
await userService.api.updateUser('123', updateData);
await userService.api.deleteUser('123');

// React hooks
function MyComponent() {
  const { data: users } = userService.hooks.useUsers();
  const { data: user } = userService.hooks.useUserById('123');
  
  const [createUser] = userService.hooks.useCreateUser({
    onSuccess: () => toast.success('User created!'),
  });
  
  const [updateUser] = userService.hooks.useUpdateUser();
  const [deleteUser] = userService.hooks.useDeleteUser();
}
```

### activityLogService

```typescript
import { activityLogService } from '@/services';

// API methods
const logs = await activityLogService.api.getActivityLog();
const filtered = await activityLogService.api.filterActivityLog({
  actor: 'user@example.com',
  action: 'created',
  startDate: '2025-01-01',
});
const { url } = await activityLogService.api.exportActivityLog('csv');

// React hooks
function ActivityLog() {
  const { data: logs } = activityLogService.hooks.useActivityLog();
  const { data: filtered } = activityLogService.hooks.useFilterActivityLog({
    action: 'created',
  });
}
```

## Common Patterns

### Loading & Error Handling

```typescript
function UsersList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!users?.length) return <EmptyState title="No users" />;

  return <UserTable users={users} />;
}
```

### Form with Mutations

```typescript
function EditUserForm({ userId }: { userId: string }) {
  const [updateUser, { isLoading }] = userService.hooks.useUpdateUser({
    onSuccess: () => {
      toast.success('User updated!');
      navigate('/users');
    },
  });

  const handleSubmit = async (formData) => {
    await updateUser({ id: userId, ...formData });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Fields */}
      <Button disabled={isLoading} type="submit">
        Save
      </Button>
    </Form>
  );
}
```

### Optimistic Updates

```typescript
function UserCard({ user }: { user: User }) {
  const [updateUser, { isLoading }] = userService.hooks.useUpdateUser({
    optimisticData: { ...user, status: 'inactive' },
    rollbackOnError: true,
  });

  const toggleStatus = async () => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await updateUser({ id: user.id, status: newStatus });
  };

  return (
    <Card>
      <Badge>{user.status}</Badge>
      <Button onClick={toggleStatus} disabled={isLoading}>
        Toggle
      </Button>
    </Card>
  );
}
```

### Dependent Queries

```typescript
function UserDetail({ userId }: { userId: string }) {
  // Fetch user only if ID is provided
  const { data: user } = userService.hooks.useUserById(userId);
  
  // Fetch activity only after user is loaded
  const { data: activity } = activityLogService.hooks.useFilterActivityLog(
    { actor: user?.email },
    { enabled: !!user }  // Only fetch when user exists
  );

  return (
    <>
      {user && <UserProfile user={user} />}
      {activity && <ActivityFeed activities={activity} />}
    </>
  );
}
```

### Background Refetching

```typescript
function UsersList() {
  const queryState = useUsers();

  useEffect(() => {
    // Refetch every 30 seconds
    const interval = setInterval(() => {
      queryState.refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [queryState]);

  return <UserTable users={queryState.data} />;
}
```

## Cache Invalidation Strategies

### Automatic (Built-in)

Mutations automatically invalidate related cache:
- POST /users → Invalidates /users cache
- PUT /users/123 → Invalidates /users* cache
- DELETE /users/123 → Invalidates /users* cache

### Manual Invalidation

```typescript
import { queryCache } from '@/services';

// Invalidate specific entry
queryCache.delete('users:list');

// Invalidate by pattern (regex)
queryCache.invalidateByPattern(/^users:/);

// Invalidate entity
queryCache.invalidateEntity('users', '123');

// Clear all
queryCache.clear();
```

### After Custom Actions

```typescript
import { queryCache } from '@/services';
import { useGlobalToast } from '@/hooks';

function BulkActionButton() {
  const { addToast } = useGlobalToast();

  const handleBulkDelete = async (userIds) => {
    try {
      await Promise.all(userIds.map(id => apiClient.delete(`/users/${id}`)));
      queryCache.invalidateEntity('users');
      addToast({ type: 'success', message: 'Users deleted!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Delete failed' });
    }
  };

  return <Button onClick={handleBulkDelete}>Delete Selected</Button>;
}
```

## Testing

### Mocking Queries

```typescript
import { queryCache } from '@/services';

beforeEach(() => {
  queryCache.clear();
});

it('should display users', async () => {
  const mockUsers = [{ id: '1', name: 'Alice' }];
  queryCache.set('users:list', mockUsers);

  render(<UsersList />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

### Mocking API Client

```typescript
import { apiClient } from '@/services';

vi.spyOn(apiClient, 'get').mockResolvedValue([
  { id: '1', name: 'Alice' },
]);
```

## Migration Guide

### Before (Old Pattern)

```typescript
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return loading ? <div>Loading</div> : <Table data={users} />;
}
```

### After (New Data Layer)

```typescript
function Users() {
  const { data: users, isLoading } = useUsers();
  return isLoading ? <Spinner /> : <Table data={users} />;
}
```

## Performance Tips

1. **Use staleTime** to prevent unnecessary refetches
2. **Enable cache** for frequently accessed data
3. **Use pagination** for large lists
4. **Implement dependent queries** to reduce parallel requests
5. **Refactor cache invalidation** to be selective (not full clear)
6. **Use optimistic updates** for better UX on mutations
7. **Leverage enabled flag** to skip unnecessary queries

## Next Steps

1. Migrate existing pages to use the new data layer
2. Add more entity services (Reports, Notifications, etc.)
3. Implement real API endpoints (replace mock data)
4. Add advanced caching strategies (stale-while-revalidate)
5. Build admin-specific table and form components
