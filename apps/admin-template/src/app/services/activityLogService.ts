/**
 * Activity Log Service
 * Data layer for activity log operations
 */

import { apiClient } from './apiClient';
import { ActivityLogEntry, PaginatedResponse } from '../types/api';
import { useQuery, usePaginatedQuery } from '../hooks/useQuery';
import { UseQueryOptions } from '../hooks/useQuery';

/**
 * API methods for activity log
 */
export const activityLogAPI = {
  /**
   * Get all activity log entries
   */
  getActivityLog: (params?: any) =>
    apiClient.get<ActivityLogEntry[]>('/activity-log', { params }),

  /**
   * Get paginated activity log
   */
  getPaginatedActivityLog: (page: number = 1, pageSize: number = 20, params?: any) =>
    apiClient.get<PaginatedResponse<ActivityLogEntry>>('/activity-log', {
      params: { page, pageSize, ...params },
    }),

  /**
   * Get activity log entry by ID
   */
  getActivityLogById: (id: string) =>
    apiClient.get<ActivityLogEntry>(`/activity-log/${id}`),

  /**
   * Filter activity log
   */
  filterActivityLog: (filters: {
    actor?: string;
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<ActivityLogEntry[]>('/activity-log/filter', { params: filters }),

  /**
   * Export activity log
   */
  exportActivityLog: (format: 'csv' | 'json' = 'csv', filters?: any) =>
    apiClient.get<{ url: string }>('/activity-log/export', {
      params: { format, ...filters },
    }),

  /**
   * Delete old entries
   */
  deleteOldEntries: (daysOld: number) =>
    apiClient.post<{ deleted: number }>('/activity-log/cleanup', { daysOld }),
};

/**
 * React hooks for activity log queries
 */
export const useActivityLog = (options?: UseQueryOptions) => {
  return useQuery<ActivityLogEntry[]>('GET', '/activity-log', options);
};

export const usePaginatedActivityLog = (
  page: number = 1,
  pageSize: number = 20,
  options?: UseQueryOptions
) => {
  return usePaginatedQuery<ActivityLogEntry>('/activity-log', {
    page,
    pageSize,
    ...options,
  });
};

export const useActivityLogById = (id: string | null, options?: UseQueryOptions) => {
  return useQuery<ActivityLogEntry>(
    'GET',
    `/activity-log/${id}`,
    { enabled: !!id, ...options }
  );
};

export const useFilterActivityLog = (
  filters?: {
    actor?: string;
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
  },
  options?: UseQueryOptions
) => {
  return useQuery<ActivityLogEntry[]>('GET', '/activity-log/filter', {
    params: filters,
    ...options,
  });
};

/**
 * Hook for exporting activity log
 */
export const useExportActivityLog = () => {
  const [mutate, state] = useQuery<{ url: string }>(
    'GET',
    '/activity-log/export',
    { enabled: false }
  ) as any;

  return {
    ...state,
    export: (format: 'csv' | 'json' = 'csv', filters?: any) =>
      activityLogAPI.exportActivityLog(format, filters),
  };
};

// Export as service object
export const activityLogService = {
  api: activityLogAPI,
  hooks: {
    useActivityLog,
    usePaginatedActivityLog,
    useActivityLogById,
    useFilterActivityLog,
    useExportActivityLog,
  },
};
