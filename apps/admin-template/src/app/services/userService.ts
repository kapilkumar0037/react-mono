/**
 * User Service
 * Data layer for user-related operations
 */

import { apiClient } from './apiClient';
import { User, PaginatedResponse } from '../types/api';
import { useQuery, usePaginatedQuery } from '../hooks/useQuery';
import { useCreateMutation, useUpdateMutation, useDeleteMutation } from '../hooks/useMutation';
import { UseQueryOptions } from '../hooks/useQuery';
import { MutationOptions } from '../types/api';

/**
 * API methods for users
 */
export const userAPI = {
  /**
   * Get all users
   */
  getUsers: (params?: any) => apiClient.get<User[]>('/users', { params }),

  /**
   * Get paginated users
   */
  getPaginatedUsers: (page: number = 1, pageSize: number = 10, params?: any) =>
    apiClient.get<PaginatedResponse<User>>('/users', {
      params: { page, pageSize, ...params },
    }),

  /**
   * Get user by ID
   */
  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),

  /**
   * Create new user
   */
  createUser: (data: Partial<User>) => apiClient.post<User>('/users', data),

  /**
   * Update user
   */
  updateUser: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),

  /**
   * Delete user
   */
  deleteUser: (id: string) => apiClient.delete<{ success: boolean }>(`/users/${id}`),

  /**
   * Bulk operations
   */
  bulkUpdateUsers: (ids: string[], data: Partial<User>) =>
    apiClient.put<{ updated: number }>('/users/bulk', { ids, data }),

  bulkDeleteUsers: (ids: string[]) =>
    apiClient.delete<{ deleted: number }>('/users/bulk', { data: { ids } }),
};

/**
 * React hooks for user queries
 */
export const useUsers = (options?: UseQueryOptions) => {
  return useQuery<User[]>('GET', '/users', options);
};

export const usePaginatedUsers = (
  page: number = 1,
  pageSize: number = 10,
  options?: UseQueryOptions
) => {
  return usePaginatedQuery<User>(`/users`, {
    page,
    pageSize,
    ...options,
  });
};

export const useUserById = (id: string | null, options?: UseQueryOptions) => {
  const queryState = useQuery<User>(
    'GET',
    `/users/${id}`,
    { enabled: !!id, ...options }
  );
  return queryState;
};

/**
 * React hooks for user mutations
 */
export const useCreateUser = (options?: MutationOptions<User>) => {
  return useCreateMutation<User>('/users', options);
};

export const useUpdateUser = (options?: MutationOptions<User>) => {
  return useUpdateMutation<User>(
    (variables) => `/users/${variables.id}`,
    options
  );
};

export const useDeleteUser = (options?: MutationOptions<{ success: boolean }>) => {
  return useDeleteMutation(
    (variables) => `/users/${variables.id}`,
    options
  );
};

export const useBulkUpdateUsers = (options?: MutationOptions<{ updated: number }>) => {
  return useCreateMutation<{ updated: number }>('/users/bulk', {
    ...options,
  });
};

export const useBulkDeleteUsers = (options?: MutationOptions<{ deleted: number }>) => {
  return useDeleteMutation('/users/bulk', options);
};

// Export as service object
export const userService = {
  api: userAPI,
  hooks: {
    useUsers,
    usePaginatedUsers,
    useUserById,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useBulkUpdateUsers,
    useBulkDeleteUsers,
  },
};
