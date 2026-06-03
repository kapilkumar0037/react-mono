/**
 * useMutation Hook
 * Handles POST, PUT, PATCH, DELETE operations with loading states and error handling
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { queryCache } from '../services/queryCache';
import { MutationOptions, ApiError } from '../types/api';

export interface UseMutationState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  reset: () => void;
}

/**
 * Hook for handling mutations (POST, PUT, PATCH, DELETE)
 */
export function useMutation<T = any>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string | ((variables: any) => string),
  options: MutationOptions<T> = {}
): [
  (variables?: any) => Promise<T | undefined>,
  UseMutationState<T>
] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (variables?: any): Promise<T | undefined> => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      let previousData = data;
      let rollback: (() => void) | null = null;

      try {
        // Optimistic update
        if (options.optimisticData) {
          previousData = data;
          setData(options.optimisticData);

          // Setup rollback
          rollback = () => {
            setData(previousData);
          };
        }

        // Determine the actual path
        const actualPath = typeof path === 'function' ? path(variables) : path;

        // Perform mutation
        const result = await apiClient.request<T>(method, actualPath, {
          data: variables,
        });

        setData(result);
        setIsError(false);

        // Invalidate related cache
        invalidateMutationCache(actualPath, method);

        // Call success callback
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setIsError(true);
        setError(apiError);

        // Rollback optimistic update on error
        if (rollback && options.rollbackOnError) {
          rollback();
        }

        // Call error callback
        options.onError?.(apiError);

        throw apiError;
      } finally {
        setIsLoading(false);
        options.onSettled?.();
      }
    },
    [data, method, path, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setIsError(false);
    setError(null);
  }, []);

  return [
    mutate,
    {
      data,
      isLoading,
      isError,
      error,
      reset,
    },
  ];
}

/**
 * Hook for CREATE operations (POST)
 */
export function useCreateMutation<T = any>(
  path: string,
  options?: MutationOptions<T>
): [
  (variables: any) => Promise<T | undefined>,
  UseMutationState<T>
] {
  return useMutation('POST', path, {
    onSuccess: (data) => {
      // Invalidate collection cache
      const entityType = path.split('/')[0];
      queryCache.invalidateByPattern(entityType);
      options?.onSuccess?.(data);
    },
    ...options,
  });
}

/**
 * Hook for UPDATE operations (PUT/PATCH)
 */
export function useUpdateMutation<T = any>(
  path: string | ((variables: any) => string),
  options?: MutationOptions<T>
): [
  (variables: any) => Promise<T | undefined>,
  UseMutationState<T>
] {
  return useMutation('PUT', path, {
    rollbackOnError: true,
    onSuccess: (data) => {
      // Invalidate item and collection cache
      const basePath = typeof path === 'string' ? path : '';
      queryCache.invalidateByPattern(basePath.split('/')[0]);
      options?.onSuccess?.(data);
    },
    ...options,
  });
}

/**
 * Hook for DELETE operations
 */
export function useDeleteMutation<T = any>(
  path: string | ((variables: any) => string),
  options?: MutationOptions<T>
): [
  (variables?: any) => Promise<T | undefined>,
  UseMutationState<T>
] {
  return useMutation('DELETE', path, {
    rollbackOnError: true,
    onSuccess: (data) => {
      // Invalidate collection cache
      const basePath = typeof path === 'string' ? path : '';
      queryCache.invalidateByPattern(basePath.split('/')[0]);
      options?.onSuccess?.(data);
    },
    ...options,
  });
}

/**
 * Invalidate cache for mutations
 */
function invalidateMutationCache(path: string, method: string): void {
  if (method === 'POST') {
    // Invalidate collection
    const entityType = path.split('/')[0];
    queryCache.invalidateByPattern(entityType);
  } else if (method === 'PUT' || method === 'PATCH') {
    // Invalidate specific item and collection
    const parts = path.split('/');
    queryCache.invalidateByPattern(parts[0]);
  } else if (method === 'DELETE') {
    // Invalidate collection
    const parts = path.split('/');
    queryCache.invalidateByPattern(parts[0]);
  }
}
