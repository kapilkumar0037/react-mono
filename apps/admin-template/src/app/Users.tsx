import React, { useState, useMemo, ChangeEvent } from 'react';
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface UsersProps {
  isDarkMode?: boolean;
}

const Users: React.FC<UsersProps> = ({ isDarkMode = false }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userPendingDelete, setUserPendingDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });

  // Mock user data
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Moderator', status: 'Active', joinDate: '2024-03-10' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Inactive', joinDate: '2024-04-05' },
    { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'User', status: 'Active', joinDate: '2024-05-12' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Admin', status: 'Active', joinDate: '2024-06-18' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Moderator', status: 'Suspended', joinDate: '2024-07-22' },
    { id: 8, name: 'Henry Taylor', email: 'henry@example.com', role: 'User', status: 'Active', joinDate: '2024-08-09' },
    { id: 9, name: 'Ivy Martinez', email: 'ivy@example.com', role: 'User', status: 'Inactive', joinDate: '2024-09-14' },
    { id: 10, name: 'Jack Anderson', email: 'jack@example.com', role: 'User', status: 'Active', joinDate: '2024-10-21' },
    { id: 11, name: 'Kelly White', email: 'kelly@example.com', role: 'User', status: 'Active', joinDate: '2024-11-03' },
    { id: 12, name: 'Leo Harris', email: 'leo@example.com', role: 'Admin', status: 'Active', joinDate: '2024-12-11' },
  ]);

  const itemsPerPage = 8;

  // Filter and search users
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

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      showToast({
        message: 'Please fill in all fields before saving the user.',
        variant: 'warning',
      });
      return;
    }

    if (isEditMode && editingUserId !== null) {
      // Edit existing user
      setUsers(
        users.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
              }
            : user
        )
      );
      showToast({
        message: `${formData.name} was updated successfully.`,
        variant: 'success',
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      showToast({
        message: `${newUser.name} was added to the user directory.`,
        variant: 'success',
      });
    }

    handleCloseModal();
  };

  const handleDeleteUser = (user: User) => {
    setUserPendingDelete(user);
  };

  const confirmDeleteUser = () => {
    if (!userPendingDelete) {
      return;
    }

    setUsers(users.filter((user) => user.id !== userPendingDelete.id));
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-gray-600">Manage and view all users in your system</p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
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

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="User">User</option>
            </select>

            {/* Status Filter */}
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

            {/* Add User Button */}
            <Button onClick={handleOpenAddModal} className="bg-blue-600 text-white">
              + Add User
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </div>
        </div>
      </Card>

      {/* Users Table */}
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
                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
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
                          className="bg-blue-500 text-white text-xs px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user)}
                          className="bg-red-500 text-white text-xs px-3 py-1"
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

        {/* Pagination */}
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

      {/* User Modal */}
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
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
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
