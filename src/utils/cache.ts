// src/utils/cache.ts
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { TRPCClientError } from '@trpc/client';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '../pages/api/trpc/book/router';

// Define cache interface
interface Cache {
  get: (key: string) => any;
  set: (key: string, value: any, ttl: number) => void;
  delete: (key: string) => void;
}

// Create a simple in-memory cache with TTL
class CacheImpl implements Cache {
  private cache: { [key: string]: { value: any; expires: number } };

  constructor() {
    this.cache = {};
  }

  get(key: string): any {
    const cached = this.cache[key];
    if (!cached || cached.expires < Date.now()) {
      delete this.cache[key];
      return null;
    }
    return cached.value;
  }

  set(key: string, value: any, ttl: number): void {
    this.cache[key] = { value, expires: Date.now() + ttl };
  }

  delete(key: string): void {
    delete this.cache[key];
  }
}

// Create a cache instance
const cache = new CacheImpl();

// Define a function to cache API responses
async function cacheResponse<T extends keyof AppRouter['_def']['queries']>(
  procedure: T,
  input: z.input<AppRouter['_def']['queries'][T]['input']>,
  ttl: number = 60 * 1000 // 1 minute
): Promise<inferProcedureOutput<AppRouter['_def']['queries'][T]>> {
  const key = `${procedure}_${JSON.stringify(input)}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  try {
    const response = await prisma.$queryRaw(
      `SELECT * FROM ${procedure}(${JSON.stringify(input)})`
    );
    cache.set(key, response, ttl);
    return response;
  } catch (error) {
    throw new TRPCClientError({
      message: 'Failed to fetch data',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

// Define a function to invalidate cache for a specific procedure
function invalidateCache(procedure: keyof AppRouter['_def']['queries']): void {
  Object.keys(cache.cache).forEach((key) => {
    if (key.startsWith(`${procedure}_`)) {
      cache.delete(key);
    }
  });
}

// Export cache functions
export { cacheResponse, invalidateCache };