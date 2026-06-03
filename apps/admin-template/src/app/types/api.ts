/**
 * Core API type definitions for the shared data layer
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryOptions {
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  onError?: (error: ApiError) => void;
  onSuccess?: (data: any) => void;
}

export interface MutationOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
  optimisticData?: any;
  rollbackOnError?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

// Entity types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'User';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface ActivityLogEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, any>;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  schedule?: string;
  format: 'pdf' | 'csv' | 'json';
  isPublic: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  permissions: string[];
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface SystemHealth {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  services: ServiceStatus[];
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  lastCheck: string;
  message?: string;
}
