/**
 * Core API Client
 * Handles HTTP requests, error handling, retries, and integration with cache
 */

import { ApiError, ApiResponse, QueryOptions, RequestConfig, HttpMethod } from '../types/api';
import { queryCache } from './queryCache';

// Mock data store for development
const mockDataStore: Record<string, any> = {
  users: [
    {
      id: 'user-1',
      email: 'alice@example.com',
      name: 'Alice Johnson',
      role: 'Owner',
      status: 'active',
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
    },
    {
      id: 'user-2',
      email: 'bob@example.com',
      name: 'Bob Smith',
      role: 'Admin',
      status: 'active',
      createdAt: '2025-01-05T09:00:00Z',
      updatedAt: '2025-01-14T14:20:00Z',
    },
  ],
  activityLog: [
    {
      id: 'log-1',
      actor: 'alice@example.com',
      action: 'created',
      entity: 'User',
      entityId: 'user-2',
      timestamp: '2025-01-05T09:00:00Z',
    },
  ],
  notifications: [],
  reports: [],
  apiKeys: [],
  backupSchedules: [],
};

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000;
  private retryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  };

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Perform an HTTP request with caching, retries, and error handling
   */
  async request<T = any>(
    method: HttpMethod,
    path: string,
    options: QueryOptions & RequestConfig = {}
  ): Promise<T> {
    const {
      cache = true,
      cacheTTL = 5 * 60 * 1000,
      retries = this.retryConfig.maxRetries,
      retryDelay = this.retryConfig.retryDelay,
      timeout = this.defaultTimeout,
      data,
      params,
      headers = {},
    } = options;

    const url = this.buildUrl(path, params);
    const cacheKey = this.getCacheKey(method, url, data);

    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cachedData = queryCache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Perform request with retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.makeRequest<T>(method, url, data, headers, timeout);
        
        // Cache successful GET responses
        if (method === 'GET' && cache) {
          queryCache.set(cacheKey, response, cacheTTL);
        }

        // Invalidate related cache entries for mutations
        if (method !== 'GET') {
          this.invalidateMutationCache(path);
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        const apiError = error as ApiError;
        const isRetryable = 
          this.retryConfig.retryableStatusCodes.includes(apiError.statusCode) &&
          attempt < retries;

        if (isRetryable) {
          // Exponential backoff
          await this.sleep(retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * GET request helper
   */
  async get<T = any>(path: string, options?: QueryOptions): Promise<T> {
    return this.request('GET', path, options);
  }

  /**
   * POST request helper
   */
  async post<T = any>(path: string, data?: any, options?: QueryOptions): Promise<T> {
    return this.request('POST', path, { ...options, data });
  }

  /**
   * PUT request helper
   */
  async put<T = any>(path: string, data?: any, options?: QueryOptions): Promise<T> {
    return this.request('PUT', path, { ...options, data });
  }

  /**
   * PATCH request helper
   */
  async patch<T = any>(path: string, data?: any, options?: QueryOptions): Promise<T> {
    return this.request('PATCH', path, { ...options, data });
  }

  /**
   * DELETE request helper
   */
  async delete<T = any>(path: string, options?: QueryOptions): Promise<T> {
    return this.request('DELETE', path, options);
  }

  /**
   * Perform the actual HTTP request
   * In development, this returns mock data
   */
  private async makeRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    headers: Record<string, string> = {},
    timeout: number = 30000
  ): Promise<T> {
    try {
      // Use mock data in development
      return await this.mockRequest<T>(method, url, data);
    } catch (error) {
      const apiError: ApiError = {
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500,
      };
      throw apiError;
    }
  }

  /**
   * Mock request handler for development
   */
  private async mockRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any
  ): Promise<T> {
    // Simulate network delay
    await this.sleep(Math.random() * 500);

    const path = url.split('/').pop() || '';

    // Handle mock responses
    if (method === 'GET') {
      if (path === 'users') {
        return mockDataStore.users as T;
      }
      if (path === 'activity-log') {
        return mockDataStore.activityLog as T;
      }
      if (path === 'notifications') {
        return mockDataStore.notifications as T;
      }
      if (path === 'reports') {
        return mockDataStore.reports as T;
      }
    }

    if (method === 'POST') {
      if (path === 'users') {
        const newUser = { ...data, id: `user-${Date.now()}` };
        mockDataStore.users.push(newUser);
        return newUser as T;
      }
    }

    if (method === 'PUT' || method === 'PATCH') {
      if (path.startsWith('users/')) {
        const userId = path.split('/')[1];
        const index = mockDataStore.users.findIndex((u: any) => u.id === userId);
        if (index >= 0) {
          mockDataStore.users[index] = {
            ...mockDataStore.users[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return mockDataStore.users[index] as T;
        }
      }
    }

    if (method === 'DELETE') {
      if (path.startsWith('users/')) {
        const userId = path.split('/')[1];
        mockDataStore.users = mockDataStore.users.filter((u: any) => u.id !== userId);
        return { success: true } as T;
      }
    }

    return { success: true } as T;
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    let url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });

      const queryString = query.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Generate cache key from request parameters
   */
  private getCacheKey(method: HttpMethod, url: string, data?: any): string {
    const key = `${method}:${url}`;
    if (data) {
      return `${key}:${JSON.stringify(data)}`;
    }
    return key;
  }

  /**
   * Invalidate cache for mutations
   */
  private invalidateMutationCache(path: string): void {
    // Invalidate entity collection cache
    const entityType = path.split('/')[1]?.split('?')[0] || '';
    queryCache.invalidateByPattern(entityType);
  }

  /**
   * Utility to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Set custom base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Get mock data store (for testing/development)
   */
  getMockDataStore(): Record<string, any> {
    return mockDataStore;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

export default ApiClient;
