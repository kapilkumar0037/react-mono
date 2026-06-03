# Shared Data Layer - Quick Start

Get started with the data layer in 5 minutes.

## Installation ✅

Already installed! All files are in:
- `src/app/services/` - API client and services
- `src/app/hooks/` - useQuery and useMutation hooks
- `src/app/types/api.ts` - Type definitions

## Basic Usage

### 1. Fetch Data

```typescript
import { useUsers } from '@/services/userService';

function MyComponent() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <ul>
    {users?.map(u => <li key={u.id}>{u.name}</li>)}
  </ul>;
}
```

### 2. Create Data

```typescript
import { useCreateUser } from '@/services/userService';

function CreateUserForm() {
  const [createUser, { isLoading }] = useCreateUser({
    onSuccess: () => alert('User created!'),
  });

  const handleSubmit = async (formData) => {
    await createUser(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 3. Update Data

```typescript
import { useUpdateUser } from '@/services/userService';

function EditUserForm({ userId }) {
  const [updateUser, { isLoading }] = useUpdateUser({
    onSuccess: () => alert('Updated!'),
  });

  const handleSubmit = async (formData) => {
    await updateUser({ id: userId, ...formData });
  };

  return <form onSubmit={...}>{/* ... */}</form>;
}
```

### 4. Delete Data

```typescript
import { useDeleteUser } from '@/services/userService';
import { useConfirmDialog, ConfirmDialog } from '@/components';

function UserActions({ userId, userName }) {
  const [deleteUser] = useDeleteUser();
  const confirm = useConfirmDialog();

  const handleDelete = () => {
    confirm.open({
      title: 'Delete User',
      message: `Delete ${userName}?`,
      isDangerous: true,
      onConfirm: async () => {
        await deleteUser({ id: userId });
      },
    });
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmDialog {...confirm} />
    </>
  );
}
```

### 5. Paginated Lists

```typescript
import { usePaginatedUsers } from '@/services/userService';

function UsersList() {
  const {
    data: users,
    page,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  } = usePaginatedUsers(1, 10); // page 1, 10 items per page

  return (
    <>
      <UserTable users={users} />
      <Pagination
        current={page}
        total={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </>
  );
}
```

## Features Overview

| Feature | Provided | Example |
|---------|----------|---------|
| Data fetching | ✅ | `useUsers()` |
| Automatic caching | ✅ | 5 min default TTL |
| Retry logic | ✅ | 3 retries with backoff |
| Loading states | ✅ | `isLoading`, `isStale` |
| Error handling | ✅ | `error`, `isError` |
| Mutations (CRUD) | ✅ | `useCreateUser()`, etc |
| Pagination | ✅ | `usePaginatedUsers()` |
| Optimistic updates | ✅ | `optimisticData` option |
| Cache invalidation | ✅ | Auto on mutations |
| Mock data | ✅ | Works without backend |

## Data Available (Mock)

### Users
- GET `/users` → List of users
- GET `/users/:id` → Single user
- POST `/users` → Create user
- PUT `/users/:id` → Update user
- DELETE `/users/:id` → Delete user

### Activity Log
- GET `/activity-log` → List of log entries
- GET `/activity-log/:id` → Single entry
- GET `/activity-log/filter?actor=...&action=...` → Filtered

## Common Patterns

### With Global Toast
```typescript
import { useGlobalToast } from '@/hooks';

function CreateUser() {
  const { addToast } = useGlobalToast();
  const [create] = useCreateUser({
    onSuccess: () => {
      addToast({ 
        type: 'success', 
        message: 'User created!' 
      });
    },
    onError: (error) => {
      addToast({ 
        type: 'error', 
        message: error.message 
      });
    },
  });

  return <form onSubmit={...}>{/* ... */}</form>;
}
```

### With Refetch
```typescript
function Users() {
  const { data: users, refetch } = useUsers();
  const [create] = useCreateUser({
    onSuccess: () => refetch(),
  });

  return <>{/* ... */}</>;
}
```

### With Dependent Queries
```typescript
import { userService } from '@/services';

function UserDetail({ userId }) {
  // Only fetch if userId exists
  const { data: user } = userService.hooks.useUserById(userId);
  
  // Only fetch activity if user exists
  const { data: activity } = userService.hooks.useFilterActivityLog(
    { actor: user?.email },
    { enabled: !!user } // Only fetch when user exists
  );

  return <>
    {user && <UserProfile user={user} />}
    {activity && <ActivityFeed activity={activity} />}
  </>;
}
```

## Cache Control

### Disable Caching
```typescript
const { data } = useUsers({ cache: false });
```

### Custom TTL
```typescript
const { data } = useUsers({ 
  cacheTTL: 30 * 60 * 1000 // 30 minutes
});
```

### Manual Invalidation
```typescript
import { queryCache } from '@/services';

// Invalidate specific
queryCache.delete('users:list');

// Invalidate pattern
queryCache.invalidateByPattern(/^users:/);

// Invalidate entity
queryCache.invalidateEntity('users', 'user-123');

// Clear all
queryCache.clear();
```

## Error Handling

```typescript
function Users() {
  const { data, error, isError } = useUsers();

  if (isError) {
    return (
      <div>
        <h2>Error loading users</h2>
        <p>{error?.message}</p>
        <code>{error?.code}</code>
      </div>
    );
  }

  return <UserTable data={data} />;
}
```

## Testing

```typescript
import { queryCache } from '@/services';

beforeEach(() => {
  queryCache.clear();
});

it('displays users', () => {
  // Mock data in cache
  queryCache.set('GET:/users', [
    { id: '1', name: 'Alice', email: 'alice@example.com' }
  ]);

  render(<Users />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

## Next Steps

1. ✅ **Understand the structure** - Read [DATA_LAYER_GUIDE.md](./DATA_LAYER_GUIDE.md)
2. **Try it out** - Use in a new component first
3. **Migrate pages** - Follow [DATA_LAYER_INTEGRATION_PATTERNS.md](./DATA_LAYER_INTEGRATION_PATTERNS.md)
4. **Connect to real API** - Update `apiClient.ts` when backend is ready
5. **Add more services** - Create `reportService.ts`, `notificationService.ts`, etc.

## Questions?

- **How do I create a new service?** → Copy `userService.ts` and adapt
- **How do I handle complex filters?** → Use query params in URL
- **How do I cache differently?** → Pass `cacheTTL` option
- **How do I test?** → Mock the hooks or clear cache between tests
- **How do I migrate existing code?** → See DATA_LAYER_INTEGRATION_PATTERNS.md

---

**You're ready to go!** Start using these hooks in your components and enjoy automatic caching, error handling, and loading states. 🚀
