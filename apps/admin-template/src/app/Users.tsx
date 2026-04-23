import React, { useEffect, useMemo, useState, ChangeEvent } from 'react';
import {
  Modal,
  Button,
  InputGroup,
  InputGroupInput,
  Card,
  Badge,
  Pagination,
  useToast,
} from '@react-mono/ui-controls';
import { useSyncedSearchQuery } from './useSyncedSearchQuery';
import {
  APP_ROLES,
  AppRole,
  DEFAULT_ROLE_DEFINITIONS,
  RoleDefinition,
  getRoleBadgeClass,
  hasPermission,
} from './rbac';
import { appendAuditEntry, DirectoryUser, persistUsers, readStoredUsers } from './rbacStorage';
import { usePageAction } from './usePageAction';

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

const Users: React.FC<UsersProps> = ({
  isDarkMode = false,
  currentRole,
  currentUserEmail,
  definitions = DEFAULT_ROLE_DEFINITIONS,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<DirectoryUser | null>(null);
  const [users, setUsers] = useState<DirectoryUser[]>(() => readStoredUsers());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'Support',
    status: 'Active',
  });

  const itemsPerPage = 8;
  const canManageUsers = hasPermission(currentRole, 'users.manage', definitions);
  const canManageRoles = hasPermission(currentRole, 'rbac.manage', definitions);

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filterRole, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleOpenAddModal = () => {
    if (!canManageUsers) {
      return;
    }

    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'Support', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: DirectoryUser) => {
    if (!canManageUsers) {
      return;
    }

    setIsEditMode(true);
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  usePageAction('add-user', () => {
    if (canManageUsers) {
      handleOpenAddModal();
    }
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'Support', status: 'Active' });
  };

  const handleSaveUser = () => {
    if (!canManageUsers) {
      showToast({
        message: 'Your role cannot change the user directory.',
        variant: 'warning',
      });
      return;
    }

    if (!formData.name || !formData.email) {
      showToast({
        message: 'Please fill in all fields before saving the user.',
        variant: 'warning',
      });
      return;
    }

    if (isEditMode && editingUserId !== null) {
      const existingUser = users.find((user) => user.id === editingUserId);
      const roleChanged = existingUser && existingUser.role !== formData.role;

      setUsers(
        users.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role: canManageRoles ? formData.role : user.role,
                status: formData.status,
              }
            : user
        )
      );

      if (roleChanged && canManageRoles) {
        appendAuditEntry({
          user: currentUserEmail ?? 'Workspace admin',
          action: 'User Role Changed',
          description: `${formData.name} was reassigned to the ${formData.role} role.`,
          timestamp: 'Just now',
          category: 'user',
          status: 'success',
        });
      }

      showToast({
        message: `${formData.name} was updated successfully.`,
        variant: 'success',
      });
    } else {
      const newUser: DirectoryUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        role: canManageRoles ? formData.role : 'Support',
        status: formData.status,
        joinDate: new Date().toISOString().split('T')[0],
      };

      setUsers([...users, newUser]);
      appendAuditEntry({
        user: currentUserEmail ?? 'Workspace admin',
        action: 'User Created',
        description: `${newUser.name} joined as ${newUser.role}.`,
        timestamp: 'Just now',
        category: 'user',
        status: 'success',
      });
      showToast({
        message: `${newUser.name} was added to the user directory.`,
        variant: 'success',
      });
    }

    handleCloseModal();
  };

  const handleDeleteUser = (user: DirectoryUser) => {
    if (!canManageUsers) {
      return;
    }

    setUserPendingDelete(user);
  };

  const confirmDeleteUser = () => {
    if (!userPendingDelete || !canManageUsers) {
      return;
    }

    setUsers(users.filter((user) => user.id !== userPendingDelete.id));
    appendAuditEntry({
      user: currentUserEmail ?? 'Workspace admin',
      action: 'User Deleted',
      description: `${userPendingDelete.name} was removed from the user directory.`,
      timestamp: 'Just now',
      category: 'user',
      status: 'success',
    });
    showToast({
      message: `${userPendingDelete.name} was removed from the user directory.`,
      variant: 'info',
    });
    setUserPendingDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Suspended':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Users</h1>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Assign roles, review statuses, and manage workspace membership.
          </p>
        </div>
        <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Your access</p>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {canManageUsers ? 'Can manage users' : 'Read-only access'}
            {canManageRoles ? ' and role assignments.' : '.'}
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InputGroup>
              <InputGroupInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </InputGroup>

            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {APP_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            <Button
              onClick={handleOpenAddModal}
              disabled={!canManageUsers}
              className="bg-blue-600 text-white disabled:bg-gray-400"
            >
              + Add User
            </Button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Showing {paginatedUsers.length} of {filteredUsers.length} users
            </div>
            {!canManageUsers && (
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Your role can review users but cannot add, edit, or delete them.
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b transition-colors border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={getStatusColor(user.status)} className="inline-block">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleOpenEditModal(user)}
                          disabled={!canManageUsers}
                          className="bg-blue-500 text-white text-xs px-3 py-1 disabled:bg-gray-400"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user)}
                          disabled={!canManageUsers}
                          className="bg-red-500 text-white text-xs px-3 py-1 disabled:bg-gray-400"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditMode ? 'Edit User' : 'Add New User'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <InputGroup>
              <InputGroupInput
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </InputGroup>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <InputGroup>
              <InputGroupInput
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </InputGroup>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={formData.role}
              disabled={!canManageRoles}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as AppRole })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            >
              {APP_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {!canManageRoles && (
              <p className="mt-2 text-xs text-gray-500">Only owners can change role assignments.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'Active' | 'Inactive' | 'Suspended',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button onClick={handleCloseModal} className="bg-gray-500 text-white">
            Cancel
          </Button>
          <Button onClick={handleSaveUser} className="bg-blue-600 text-white">
            {isEditMode ? 'Update' : 'Add'} User
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={userPendingDelete !== null}
        onClose={() => setUserPendingDelete(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {userPendingDelete
              ? `Are you sure you want to delete ${userPendingDelete.name}? This mock action removes them from the current session.`
              : 'Are you sure you want to delete this user?'}
          </p>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setUserPendingDelete(null)} className="bg-gray-500 text-white">
              Cancel
            </Button>
            <Button onClick={confirmDeleteUser} className="bg-red-600 text-white">
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
