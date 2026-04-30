# Global Toast & Action Feedback System

## Overview

This system provides a standardized way to handle user feedback across the admin dashboard. It includes:

- **Global Toast Notifications** - Display messages to users (success, error, warning, info)
- **Action Feedback Hooks** - Standardized patterns for CRUD operations with automatic loading/error states
- **Confirmation Dialogs** - Reusable confirmation modal for destructive actions

## Installation & Setup

The system is already integrated into the main `App` component via providers:

```tsx
// In app.tsx - Already configured
<GlobalToastProvider>
  <GlobalToastContainer isDarkMode={isDarkMode} position="bottom-right" />
  {/* Your routes */}
</GlobalToastProvider>
```

## Usage

### 1. Basic Toast Notifications

Show simple notifications to the user:

```tsx
import { useGlobalToast } from './hooks/useGlobalToast';

function MyComponent() {
  const { addToast } = useGlobalToast();

  const handleClick = () => {
    addToast({
      type: 'success',
      message: 'Operation completed!',
      duration: 5000, // auto-close after 5 seconds
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

**Toast Types:**
- `success` - Green toast for successful operations
- `error` - Red toast for errors
- `warning` - Yellow toast for warnings
- `info` - Blue toast for informational messages

### 2. Action Feedback Hooks

For standard CRUD operations, use specialized hooks that handle loading states and automatic toast feedback:

#### Create Operation

```tsx
import { useCreateAction } from './hooks/useActionFeedback';

function AddUserForm() {
  const createUser = useCreateAction('User');

  const handleSubmit = async (userData) => {
    const result = await createUser.execute(
      async () => {
        // Your async operation
        const response = await api.createUser(userData);
        return response;
      },
      {
        successMessage: 'User created successfully',
        errorMessage: 'Failed to create user',
        showSuccess: true, // Shows success toast
      }
    );

    if (result.success) {
      // Handle success - result.data contains the response
      console.log('Created:', result.data);
    } else {
      // Handle error - result.error contains the error
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      <button onClick={() => handleSubmit()} disabled={createUser.isLoading}>
        {createUser.isLoading ? 'Creating...' : 'Create User'}
      </button>
      {createUser.error && <p className="text-red-600">{createUser.error.message}</p>}
    </div>
  );
}
```

#### Update Operation

```tsx
import { useUpdateAction } from './hooks/useActionFeedback';

function EditUserForm() {
  const updateUser = useUpdateAction('User Settings');

  const handleUpdate = async (userId, updates) => {
    const result = await updateUser.execute(
      async () => {
        return await api.updateUser(userId, updates);
      }
    );

    if (result.success) {
      // Refresh or navigate
    }
  };

  return <button onClick={() => handleUpdate()}>Save Changes</button>;
}
```

#### Delete Operation

```tsx
import { useDeleteAction } from './hooks/useActionFeedback';

function DeleteUserButton({ userId, userName }) {
  const deleteUser = useDeleteAction(userName);

  const handleDelete = async () => {
    const result = await deleteUser.execute(
      async () => {
        return await api.deleteUser(userId);
      }
    );

    if (result.success) {
      // Navigate away or refresh list
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteUser.isLoading}>
      {deleteUser.isLoading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

#### Export Operation

```tsx
import { useExportAction } from './hooks/useActionFeedback';

function ExportButton({ users }) {
  const exportAction = useExportAction('User Directory');

  const handleExport = async () => {
    await exportAction.execute(
      async () => {
        const csv = generateCSV(users);
        downloadFile(csv, 'users.csv');
        return csv;
      }
    );
  };

  return <button onClick={handleExport}>Export as CSV</button>;
}
```

#### Custom Actions

For non-standard operations:

```tsx
import { useActionFeedback } from './hooks/useActionFeedback';

function MyComponent() {
  const action = useActionFeedback({
    type: 'custom',
    itemName: 'Report',
  });

  const handleClick = async () => {
    await action.execute(
      async () => {
        return await api.generateReport();
      },
      {
        successMessage: 'Report generated successfully',
        errorMessage: 'Failed to generate report',
      }
    );
  };

  return <button onClick={handleClick}>Generate Report</button>;
}
```

### 3. Confirmation Dialogs

Use the `useConfirmDialog` hook to show confirmation modals for destructive actions:

```tsx
import { useConfirmDialog, ConfirmDialog } from './components/ConfirmDialog';

function UserCard({ user }) {
  const deleteConfirm = useConfirmDialog();

  const handleDeleteClick = () => {
    deleteConfirm.open({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        await api.deleteUser(user.id);
        // Navigate or refresh
      },
    });
  };

  return (
    <>
      <button onClick={handleDeleteClick}>Delete</button>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        isDarkMode={isDarkMode}
        title={deleteConfirm.options?.title || ''}
        message={deleteConfirm.options?.message || ''}
        confirmLabel={deleteConfirm.options?.confirmLabel}
        isDangerous={deleteConfirm.options?.isDangerous}
        isLoading={deleteConfirm.isLoading}
        onConfirm={deleteConfirm.options?.onConfirm || (() => {})}
        onCancel={deleteConfirm.close}
      />
    </>
  );
}
```

## Complete Example: Users Page Integration

The Users page has been updated to use the new system. Key changes:

1. **Replaced old `showToast` with `addToast`**
   ```tsx
   // Before
   showToast({ message: 'User created', variant: 'success' });
   
   // After
   addToast({ type: 'success', message: 'User created' });
   ```

2. **Used specialized hooks for operations**
   ```tsx
   const createUserAction = useCreateAction('User');
   const deleteConfirm = useConfirmDialog();
   ```

3. **Better UX with confirmation dialogs**
   ```tsx
   const confirmDeleteUser = (user) => {
     deleteConfirm.open({
       title: 'Delete User',
       message: `Delete ${user.name}?`,
       isDangerous: true,
       onConfirm: async () => {
         // Delete logic
       },
     });
   };
   ```

## Best Practices

1. **Use action hooks for async operations** - Provides automatic loading/error state management
2. **Always ask for confirmation on destructive actions** - Use `useConfirmDialog` for deletes and other dangerous ops
3. **Provide context-specific messages** - Pass the entity name to `useCreateAction('User')` etc
4. **Let toasts auto-close** - Most operations are better served by auto-dismissing toasts (5s default)
5. **Use danger pattern for destructive actions** - Set `isDangerous: true` on confirmation dialogs for deletes
6. **Combine with error boundaries** - The ErrorBoundary component already exists, just use it for page-level failures

## Component API Reference

### `useGlobalToast()`

```tsx
const { toasts, addToast, removeToast, clearAllToasts } = useGlobalToast();

addToast({
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration?: number, // ms, default 5000
  action?: {
    label: string,
    onClick: () => void,
  },
});
```

### `useActionFeedback(options)`

```tsx
const { isLoading, error, execute, reset } = useActionFeedback({
  type: 'create' | 'update' | 'delete' | 'export' | 'restore' | 'import' | 'custom',
  itemName?: string,
  onError?: (error: Error) => void,
  toastDuration?: number,
});

const result = await execute(
  asyncFn: () => Promise<T>,
  options?: {
    successMessage?: string,
    errorMessage?: string,
    showSuccess?: boolean,
  }
);
```

### `useConfirmDialog()`

```tsx
const { isOpen, open, close, options, isLoading } = useConfirmDialog();

open({
  title: string,
  message: string | ReactNode,
  confirmLabel?: string,
  cancelLabel?: string,
  isDangerous?: boolean,
  isLoading?: boolean,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void,
});
```

### `GlobalToastContainer`

```tsx
<GlobalToastContainer
  isDarkMode={boolean}
  position="top-right" | "top-left" | "bottom-right" | "bottom-left"
/>
```

## Migration Guide

### Migrating from old Toast System

Old code:
```tsx
import { useToast } from '@react-mono/ui-controls';

const { showToast } = useToast();
showToast({ message: 'Success', variant: 'success' });
```

New code:
```tsx
import { useGlobalToast } from './hooks/useGlobalToast';

const { addToast } = useGlobalToast();
addToast({ type: 'success', message: 'Success' });
```

Variant mapping:
- `success` → `success`
- `danger` → `error`
- `warning` → `warning`
- `info` → `info`

### Migrating Confirmation Dialogs

Old: Using multiple state variables and Modal components
New: Single `useConfirmDialog` hook with ConfirmDialog component

See Users.tsx for a complete example of the refactoring.

---

## Next Steps

Apply this system to other pages:
- **Orders Page** - Add confirmation on order cancellations, use export action
- **Activity Log** - Use delete action for manual record cleanup
- **Settings** - Use update action for all form submissions
- **Dashboard** - Add toast feedback to all interactive widgets

Each page integration will improve the overall consistency and polish of the admin dashboard.
