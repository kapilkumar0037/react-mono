/**
 * Query Cache System
 * Handles caching of API responses with TTL and invalidation
 */

import { CacheEntry } from '../types/api';

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private observers = new Map<string, Set<() => void>>();
  private timers = new Map<string, NodeJS.Timeout>();

  /**
   * Get a value from cache if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Auto-invalidate after TTL
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
    this.notify(key);
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
      this.timers.delete(key);
    }
    this.notify(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidateByPattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.delete(key));
  }

  /**
   * Invalidate all entries for a specific entity
   */
  invalidateEntity(entityType: string, entityId?: string): void {
    const pattern = entityId 
      ? `${entityType}:${entityId}`
      : entityType;
    this.invalidateByPattern(pattern);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
    this.observers.forEach((set) => {
      set.forEach((callback) => callback());
    });
  }

  /**
   * Subscribe to cache changes for a key
   */
  subscribe(key: string, callback: () => void): () => void {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.observers.get(key)?.delete(callback);
    };
  }

  /**
   * Notify all observers of a key change
   */
  private notify(key: string): void {
    this.observers.get(key)?.forEach((callback) => callback());
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        expired: Date.now() - entry.timestamp > entry.ttl,
      })),
    };
  }
}

// Singleton instance
export const queryCache = new QueryCache();

export default QueryCache;
