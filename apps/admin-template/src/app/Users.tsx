import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Modal, Button, InputGroup, InputGroupInput, Card, Badge, Pagination } from '@react-mono/ui-controls';
import { useSearchParams } from 'react-router-dom';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';
import { APP_ROLES, AppRole, DEFAULT_ROLE_DEFINITIONS, RoleDefinition, getRoleBadgeClass, hasPermission } from './rbac';
import { appendAuditEntry, DirectoryUser, persistUsers, readStoredUsers } from './rbacStorage';
import { usePageAction } from './usePageAction';
import { createSavedView, persistSavedViews, readSavedViews, SavedView } from './savedViews';
import AdminActionConfirm from './AdminActionConfirm';
import { useGlobalToast } from './hooks/useGlobalToast';
import { useUpdateAction, useCreateAction, useDeleteAction, useExportAction } from './hooks/useActionFeedback';
import { useConfirmDialog, ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { useFilterPresets } from './hooks/useFilterPresets';
import { FilterPresets } from './components/FilterPresets';
import { ActiveFilters } from './components/ActiveFilters';
import { ExportDialog } from './components/ExportDialog';

interface FormData {
  name: string;
  email: string;
  role: AppRole;
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface UsersProps {
  isDarkMode?: boolean;
  currentRole: AppRole;
  currentUserEmail?: string;
  definitions?: Record<AppRole, RoleDefinition>;
}

interface UserViewFilters {
  q: string;
  role: string;
  status: string;
}

const Users: React.FC<UsersProps> = ({ isDarkMode = false, currentRole, currentUserEmail, definitions = DEFAULT_ROLE_DEFINITIONS }) => {
  const { addToast } = useGlobalToast();
  const createUserAction = useCreateAction('User');
  const updateUserAction = useUpdateAction('User');
  const deleteUserAction = useDeleteAction('User');
  const exportAction = useExportAction('User Directory');
  const deleteConfirm = useConfirmDialog();
  const bulkDeleteConfirm = useConfirmDialog();
  const filterPresets = useFilterPresets('users');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [filterRole, setFilterRole] = useState<string>(() => searchParams.get('role') ?? 'all');
  const [filterStatus, setFilterStatus] = useState<string>(() => searchParams.get('status') ?? 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [users, setUsers] = useState<DirectoryUser[]>(() => readStoredUsers());
  const [savedViews, setSavedViews] = useState<SavedView<UserViewFilters>[]>(() => readSavedViews<UserViewFilters>('users'));
  const [viewName, setViewName] = useState('');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', role: 'Support', status: 'Active' });

  const itemsPerPage = 8;
  const canManageUsers = hasPermission(currentRole, 'users.manage', definitions);
  const canManageRoles = hasPermission(currentRole, 'rbac.manage', definitions);

  const getStatusColor = (status: DirectoryUser['status']) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Suspended':
        return 'warning';
      case 'Inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    filterRole !== 'all' ? nextParams.set('role', filterRole) : nextParams.delete('role');
    filterStatus !== 'all' ? nextParams.set('status', filterStatus) : nextParams.delete('status');
    setSearchParams(nextParams, { replace: true });
  }, [filterRole, filterStatus, searchParams, setSearchParams]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const q = searchQuery.toLowerCase();
        return (user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)) && (filterRole === 'all' || user.role === filterRole) && (filterStatus === 'all' || user.status === filterStatus);
      }),
    [users, searchQuery, filterRole, filterStatus]
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => filteredUsers.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage), [filteredUsers, currentPage]);
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedUserIds.includes(user.id));
  const selectedUsers = users.filter((user) => selectedUserIds.includes(user.id));

  usePageAction('add-user', () => {
    if (!canManageUsers) return;
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'Support', status: 'Active' });
    setIsModalOpen(true);
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'Support', status: 'Active' });
  };

  const handleOpenEditModal = (user: DirectoryUser) => {
    if (!canManageUsers) return;
    setIsEditMode(true);
    setEditingUserId(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!canManageUsers) {
      addToast({ 
        type: 'warning', 
        message: 'Your role cannot change the user directory.' 
      });
      return;
    }
    if (!formData.name || !formData.email) {
      addToast({ 
        type: 'warning', 
        message: 'Please fill in all fields before saving the user.' 
      });
      return;
    }
    
    if (isEditMode && editingUserId !== null) {
      const existingUser = users.find((user) => user.id === editingUserId);
      const roleChanged = existingUser && existingUser.role !== formData.role;
      
      setUsers(users.map((user) => 
        user.id === editingUserId 
          ? { ...user, name: formData.name, email: formData.email, role: canManageRoles ? formData.role : user.role, status: formData.status } 
          : user
      ));
      
      if (roleChanged && canManageRoles) {
        appendAuditEntry({ 
          user: currentUserEmail ?? 'Workspace admin', 
          action: 'User Role Changed', 
          description: `${formData.name} was reassigned to the ${formData.role} role.`, 
          timestamp: 'Just now', 
          category: 'user', 
          status: 'success' 
        });
      }
      
      addToast({ 
        type: 'success', 
        message: `${formData.name} updated successfully` 
      });
    } else {
      const newUser: DirectoryUser = { 
        id: Math.max(...users.map((u) => u.id), 0) + 1, 
        name: formData.name, 
        email: formData.email, 
        role: canManageRoles ? formData.role : 'Support', 
        status: formData.status, 
        joinDate: new Date().toISOString().split('T')[0] 
      };
      
      setUsers([...users, newUser]);
      appendAuditEntry({ 
        user: currentUserEmail ?? 'Workspace admin', 
        action: 'User Created', 
        description: `${newUser.name} joined as ${newUser.role}.`, 
        timestamp: 'Just now', 
        category: 'user', 
        status: 'success' 
      });
      
      addToast({ 
        type: 'success', 
        message: `${newUser.name} added to the directory` 
      });
    }
    handleCloseModal();
  };

  const confirmDeleteUser = (user: DirectoryUser) => {
    deleteConfirm.open({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        setUsers(users.filter((u) => u.id !== user.id));
        appendAuditEntry({ 
          user: currentUserEmail ?? 'Workspace admin', 
          action: 'User Deleted', 
          description: `${user.name} was removed from the user directory.`, 
          timestamp: 'Just now', 
          category: 'user', 
          status: 'success' 
        });
        addToast({ 
          type: 'info', 
          message: `${user.name} has been deleted` 
        });
      },
    });
  };

  const applyBulkStatus = (status: DirectoryUser['status']) => {
    if (!canManageUsers || selectedUserIds.length === 0) return;
    setUsers((currentUsers) => 
      currentUsers.map((user) => 
        selectedUserIds.includes(user.id) ? { ...user, status } : user
      )
    );
    appendAuditEntry({ 
      user: currentUserEmail ?? 'Workspace admin', 
      action: 'Users Updated', 
      description: `${selectedUserIds.length} user${selectedUserIds.length === 1 ? '' : 's'} marked ${status.toLowerCase()}.`, 
      timestamp: 'Just now', 
      category: 'user', 
      status: 'success' 
    });
    setSelectedUserIds([]);
    addToast({ 
      type: 'success', 
      message: `${selectedUserIds.length} user${selectedUserIds.length === 1 ? '' : 's'} marked ${status.toLowerCase()}` 
    });
  };

  const confirmBulkDelete = () => {
    bulkDeleteConfirm.open({
      title: 'Delete Selected Users',
      message: `Remove ${selectedUserIds.length} selected user${selectedUserIds.length === 1 ? '' : 's'} from the directory? This action cannot be undone.`,
      confirmLabel: 'Delete',
      isDangerous: true,
      onConfirm: async () => {
        setUsers((currentUsers) => 
          currentUsers.filter((user) => !selectedUserIds.includes(user.id))
        );
        appendAuditEntry({ 
          user: currentUserEmail ?? 'Workspace admin', 
          action: 'Users Deleted', 
          description: `${selectedUserIds.length} user${selectedUserIds.length === 1 ? '' : 's'} removed from the directory.`, 
          timestamp: 'Just now', 
          category: 'user', 
          status: 'success' 
        });
        addToast({ 
          type: 'info', 
          message: `${selectedUserIds.length} user${selectedUserIds.length === 1 ? '' : 's'} deleted` 
        });
        setSelectedUserIds([]);
      },
    });
  };
  
  const exportSelectedUsers = async () => {
    if (selectedUserIds.length === 0) return;
    setIsExportDialogOpen(true);
  };

  const handleSaveView = () => {
    if (!viewName.trim()) { 
      addToast({ 
        type: 'warning', 
        message: 'Name the view before saving it.' 
      });
      return;
    }
    const nextViews = [...savedViews, createSavedView(viewName.trim(), { q: searchQuery, role: filterRole, status: filterStatus })];
    setSavedViews(nextViews); 
    persistSavedViews('users', nextViews); 
    setViewName(''); 
    addToast({ 
      type: 'success', 
      message: 'Saved view created' 
    });
  };

  const applySavedView = (filters: UserViewFilters) => {
    setSearchQuery(filters.q);
    setFilterRole(filters.role);
    setFilterStatus(filters.status);
    setCurrentPage(1);
  };

  const handleLoadFilterPreset = (presetId: string) => {
    const filters = filterPresets.loadPreset(presetId);
    if (filters) {
      setSearchQuery(filters.q || '');
      setFilterRole(filters.role || 'all');
      setFilterStatus(filters.status || 'all');
      setCurrentPage(1);
      addToast({ type: 'success', message: 'Filter preset loaded' });
    }
  };

  const handleSaveFilterPreset = (name: string, filters: Record<string, any>) => {
    filterPresets.savePreset(name, filters);
    addToast({ type: 'success', message: `Filter preset "${name}" saved` });
  };

  const handleDeleteFilterPreset = (presetId: string) => {
    filterPresets.deletePreset(presetId);
    addToast({ type: 'info', message: 'Filter preset deleted' });
  };

  const handleRenameFilterPreset = (presetId: string, newName: string) => {
    filterPresets.renamePreset(presetId, newName);
    addToast({ type: 'success', message: 'Filter preset renamed' });
  };

  const handleSetDefaultPreset = (presetId: string) => {
    filterPresets.setAsDefault(presetId);
    addToast({ type: 'success', message: 'Default filter preset set' });
  };

  const handleClearFilter = (key: string) => {
    switch (key) {
      case 'q':
        setSearchQuery('');
        break;
      case 'role':
        setFilterRole('all');
        break;
      case 'status':
        setFilterStatus('all');
        break;
    }
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setFilterRole('all');
    setFilterStatus('all');
    setCurrentPage(1);
    addToast({ type: 'info', message: 'All filters cleared' });
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Users</h1><p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assign roles, review statuses, and manage workspace membership.</p></div>
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}><p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your access</p><p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{canManageUsers ? 'Can manage users' : 'Read-only access'}{canManageRoles ? ' and role assignments.' : '.'}</p></div>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <FilterPresets
            presets={filterPresets.presets}
            onLoadPreset={handleLoadFilterPreset}
            onDeletePreset={handleDeleteFilterPreset}
            onRenamePreset={handleRenameFilterPreset}
            onSetAsDefault={handleSetDefaultPreset}
            onSaveNew={handleSaveFilterPreset}
            currentFilters={{ q: searchQuery, role: filterRole, status: filterStatus }}
          />
          <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1"><p className="text-sm font-semibold text-gray-900">Saved Views</p><p className="mt-1 text-sm text-gray-600">Save filters and reuse the current URL as a shareable view.</p></div>
            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end"><input type="text" value={viewName} onChange={(event) => setViewName(event.target.value)} placeholder="Name this view" className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /><Button onClick={handleSaveView} className="bg-gray-900 text-white">Save View</Button></div>
          </div>
          {savedViews.length > 0 && <div className="mb-6 flex flex-wrap gap-2">{savedViews.map((view) => <div key={view.id} className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1"><button type="button" onClick={() => applySavedView(view.filters)} className="text-sm font-medium text-gray-700">{view.name}</button><button type="button" onClick={() => { const nextViews = savedViews.filter((savedView) => savedView.id !== view.id); setSavedViews(nextViews); persistSavedViews('users', nextViews); }} className="px-1 text-xs text-gray-500" aria-label={`Delete ${view.name}`}>x</button></div>)}</div>}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InputGroup><InputGroupInput placeholder="Search by name or email..." value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }} /></InputGroup>
            <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"><option value="all">All Roles</option>{APP_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"><option value="all">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option></select>
            <Button onClick={() => { if (!canManageUsers) return; setIsEditMode(false); setEditingUserId(null); setFormData({ name: '', email: '', role: 'Support', status: 'Active' }); setIsModalOpen(true); }} disabled={!canManageUsers} className="bg-blue-600 text-white disabled:bg-gray-400">+ Add User</Button>
          </div>
          <ActiveFilters
            filters={{ q: searchQuery, role: filterRole, status: filterStatus }}
            onClearFilter={handleClearFilter}
            onClearAll={handleClearAllFilters}
            filterLabels={{ q: 'Search', role: 'Role', status: 'Status' }}
          />
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div className="text-sm text-gray-600">Showing {paginatedUsers.length} of {filteredUsers.length} users</div>{!canManageUsers && <div className="text-sm text-amber-700 dark:text-amber-300">Your role can review users but cannot add, edit, or delete them.</div>}</div>
        </div>
      </Card>

      <Card>
        {selectedUserIds.length > 0 && <div className="border-b border-gray-200 bg-gray-50 px-6 py-3"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="text-sm font-medium text-gray-700">{selectedUserIds.length} user{selectedUserIds.length === 1 ? '' : 's'} selected</div><div className="flex flex-wrap gap-2"><Button onClick={() => setSelectedUserIds([])} className="bg-gray-600 px-3 py-1.5 text-xs text-white">Clear</Button><Button onClick={exportSelectedUsers} className="bg-gray-700 px-3 py-1.5 text-xs text-white">Export</Button><Button onClick={() => applyBulkStatus('Active')} disabled={!canManageUsers} className="bg-green-600 px-3 py-1.5 text-xs text-white disabled:bg-gray-400">Activate</Button><Button onClick={() => applyBulkStatus('Suspended')} disabled={!canManageUsers} className="bg-amber-600 px-3 py-1.5 text-xs text-white disabled:bg-gray-400">Suspend</Button><Button onClick={confirmBulkDelete} disabled={!canManageUsers} className="bg-red-600 px-3 py-1.5 text-xs text-white disabled:bg-gray-400">Delete</Button></div></div></div>}
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No users found"
            description="Try adjusting your search or filters"
            action={canManageUsers ? { label: '+ Add User', onClick: () => setIsModalOpen(true) } : undefined}
            isDarkMode={isDarkMode}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-200 bg-gray-50"><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"><input type="checkbox" checked={allFilteredSelected} onChange={() => { const filteredIds = filteredUsers.map((user) => user.id); setSelectedUserIds((ids) => (filteredIds.every((id) => ids.includes(id)) ? ids.filter((id) => !filteredIds.includes(id)) : Array.from(new Set([...ids, ...filteredIds])))); }} className="h-4 w-4 rounded" aria-label="Select all filtered users" /></th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Join Date</th><th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th></tr></thead>
                <tbody>
                  {paginatedUsers.map((user) => <tr key={user.id} className="border-b border-gray-200 transition-colors hover:bg-gray-50"><td className="px-6 py-4 text-sm"><input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => setSelectedUserIds((ids) => (ids.includes(user.id) ? ids.filter((id) => id !== user.id) : [...ids, user.id]))} className="h-4 w-4 rounded" aria-label={`Select ${user.name}`} /></td><td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td><td className="px-6 py-4 text-sm text-gray-600">{user.email}</td><td className="px-6 py-4 text-sm"><span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>{user.role}</span></td><td className="px-6 py-4 text-sm"><Badge variant={getStatusColor(user.status)} className="inline-block">{user.status}</Badge></td><td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td><td className="px-6 py-4 text-sm"><div className="flex gap-2"><Button onClick={() => handleOpenEditModal(user)} disabled={!canManageUsers} className="bg-blue-500 px-3 py-1 text-xs text-white disabled:bg-gray-400">Edit</Button><Button onClick={() => canManageUsers && confirmDeleteUser(user)} disabled={!canManageUsers} className="bg-red-500 px-3 py-1 text-xs text-white disabled:bg-gray-400">Delete</Button></div></td></tr>)}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && <div className="border-t p-4"><Pagination currentPage={currentPage} totalItems={filteredUsers.length} pageSize={itemsPerPage} onPageChange={setCurrentPage} /></div>}
          </>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? 'Edit User' : 'Add New User'}>
        <div className="space-y-4">
          <div><label className="mb-2 block text-sm font-medium">Name</label><InputGroup><InputGroupInput placeholder="Enter full name" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} /></InputGroup></div>
          <div><label className="mb-2 block text-sm font-medium">Email</label><InputGroup><InputGroupInput type="email" placeholder="Enter email address" value={formData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} /></InputGroup></div>
          <div><label className="mb-2 block text-sm font-medium">Role</label><select value={formData.role} disabled={!canManageRoles} onChange={(e) => setFormData({ ...formData, role: e.target.value as AppRole })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500">{APP_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select>{!canManageRoles && <p className="mt-2 text-xs text-gray-500">Only owners can change role assignments.</p>}</div>
          <div><label className="mb-2 block text-sm font-medium">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Suspended' })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option></select></div>
        </div>
        <div className="mt-6 flex justify-end gap-2"><Button onClick={handleCloseModal} className="bg-gray-500 text-white">Cancel</Button><Button onClick={handleSaveUser} className="bg-blue-600 text-white">{isEditMode ? 'Update' : 'Add'} User</Button></div>
      </Modal>

      <ConfirmDialog 
        isOpen={deleteConfirm.isOpen}
        isDarkMode={isDarkMode}
        title={deleteConfirm.options?.title || 'Confirm'}
        message={deleteConfirm.options?.message || ''}
        confirmLabel={deleteConfirm.options?.confirmLabel}
        cancelLabel={deleteConfirm.options?.cancelLabel}
        isDangerous={deleteConfirm.options?.isDangerous}
        isLoading={deleteConfirm.isLoading}
        onConfirm={deleteConfirm.options?.onConfirm || (() => {})}
        onCancel={deleteConfirm.close}
      />

      <ConfirmDialog 
        isOpen={bulkDeleteConfirm.isOpen}
        isDarkMode={isDarkMode}
        title={bulkDeleteConfirm.options?.title || 'Confirm'}
        message={bulkDeleteConfirm.options?.message || ''}
        confirmLabel={bulkDeleteConfirm.options?.confirmLabel}
        cancelLabel={bulkDeleteConfirm.options?.cancelLabel}
        isDangerous={bulkDeleteConfirm.options?.isDangerous}
        isLoading={bulkDeleteConfirm.isLoading}
        onConfirm={bulkDeleteConfirm.options?.onConfirm || (() => {})}
        onCancel={bulkDeleteConfirm.close}
      />

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        data={users}
        selectedCount={selectedUserIds.length}
        selectedData={selectedUserIds.length > 0 ? users.filter(u => selectedUserIds.includes(u.id)) : []}
        pageTitle="Users"
        columnLabels={{
          id: 'ID',
          name: 'Name',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          joinDate: 'Join Date',
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Users;
