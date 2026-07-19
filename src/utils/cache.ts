// src/utils/cache.ts
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { TRPCClientError } from '@trpc/client';
import { inferProcedureOutput } from '@trpc/server';

interface CacheConfig {
  ttl: number; // time to live in seconds
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class Cache<T> {
  private cache: Record<string, CacheEntry<T>> = {};
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  async get(key: string): Promise<T | null> {
    const cacheEntry = this.cache[key];
    if (!cacheEntry) return null;
    if (cacheEntry.expiresAt < Date.now()) {
      delete this.cache[key];
      return null;
    }
    return cacheEntry.data;
  }

  async set(key: string, data: T): Promise<void> {
    const expiresAt = Date.now() + this.config.ttl * 1000;
    this.cache[key] = { data, expiresAt };
  }

  async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }
}

const cacheConfig: CacheConfig = {
  ttl: 60, // 1 minute
};

const cache = new Cache(cacheConfig);

export const getCache = async <T>(key: string): Promise<T | null> => {
  return await cache.get(key);
};

export const setCache = async <T>(key: string, data: T): Promise<void> => {
  await cache.set(key, data);
};

export const invalidateCache = async (key: string): Promise<void> => {
  await cache.invalidate(key);
};

// Example usage:
// const cachedData = await getCache('books');
// if (!cachedData) {
//   const data = await prisma.book.findMany();
//   await setCache('books', data);
// }

// Invalidate cache when data changes
// await invalidateCache('books');

// Use with tRPC
export const withCache = async <T>(
  input: z.ZodObject<any>,
  procedure: (input: z.infer<typeof input>) => Promise<inferProcedureOutput<T>>,
): Promise<inferProcedureOutput<T>> => {
  const cacheKey = JSON.stringify(input);
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const data = await procedure(input.parse(input));
    await setCache(cacheKey, data);
    return data;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      throw error;
    }
    console.error(error);
    throw error;
  }
};