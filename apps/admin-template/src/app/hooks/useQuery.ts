/**
 * useQuery Hook
 * Handles data fetching, caching, loading, and error states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiClient';
import { queryCache } from '../services/queryCache';
import { QueryOptions, ApiError } from '../types/api';

export interface UseQueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export interface UseQueryOptions extends QueryOptions {
  enabled?: boolean;
  staleTime?: number; // How long before data is considered stale
}

/**
 * Hook for fetching data with automatic caching and state management
 */
export function useQuery<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  options: UseQueryOptions = {}
): UseQueryState<T> {
  const {
    enabled = true,
    cache = true,
    cacheTTL = 5 * 60 * 1000,
    staleTime = 0,
    ...queryOptions
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isStale, setIsStale] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const cacheKeyRef = useRef<string>(`${method}:${path}`);
  const fetchTimestampRef = useRef<number>(0);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await apiClient.request<T>(method, path, {
        cache,
        cacheTTL,
        ...queryOptions,
      });

      setData(response);
      fetchTimestampRef.current = Date.now();
      setIsStale(false);
    } catch (err) {
      const apiError = err as ApiError;
      setIsError(true);
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [method, path, cache, cacheTTL, enabled, queryOptions]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Check stale time
    if (staleTime > 0 && fetchTimestampRef.current > 0) {
      const age = Date.now() - fetchTimestampRef.current;
      setIsStale(age > staleTime);
    }

    // Subscribe to cache changes
    if (cache) {
      unsubscribeRef.current = queryCache.subscribe(cacheKeyRef.current, () => {
        const cachedData = queryCache.get<T>(cacheKeyRef.current);
        if (cachedData) {
          setData(cachedData);
          setIsStale(false);
        }
      });
    }

    // Initial fetch
    refetch();

    // Cleanup subscription
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [enabled, cache, refetch, staleTime]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isStale,
  };
}

/**
 * Hook for simple GET requests
 */
export function useGetQuery<T = any>(
  path: string,
  options?: UseQueryOptions
): UseQueryState<T> {
  return useQuery('GET', path, options);
}

/**
 * Hook for paginated data
 */
export interface UsePaginatedQueryOptions extends UseQueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UsePaginatedQueryState<T> extends UseQueryState<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePaginatedQuery<T = any>(
  path: string,
  options: UsePaginatedQueryOptions = {}
): UsePaginatedQueryState<T> {
  const [page, setPage] = useState(options.page || 1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);

  const queryPath = `${path}?page=${page}&pageSize=${pageSize}${
    options.sortBy ? `&sortBy=${options.sortBy}&sortOrder=${options.sortOrder || 'asc'}` : ''
  }`;

  const queryState = useQuery<any>('GET', queryPath, options);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const totalPages = queryState.data?.totalPages || 1;
  const total = queryState.data?.total || 0;

  return {
    ...queryState,
    page,
    pageSize,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
  };
}
