// src/utils/cache.ts
import { z } from 'zod';
import { prisma } from '../utils/prisma';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

const cache: { [key: string]: CacheEntry } = {};

const ttl = 60 * 1000; // 1 minute

const cacheKeySchema = z.string();

const getCacheKey = (key: string) => {
  return cacheKeySchema.parse(key);
};

const getCacheEntry = (key: string) => {
  const cacheKey = getCacheKey(key);
  return cache[cacheKey];
};

const setCacheEntry = (key: string, data: any) => {
  const cacheKey = getCacheKey(key);
  const expiresAt = Date.now() + ttl;
  cache[cacheKey] = { data, expiresAt };
};

const deleteCacheEntry = (key: string) => {
  const cacheKey = getCacheKey(key);
  delete cache[cacheKey];
};

const isCacheEntryValid = (entry: CacheEntry) => {
  return entry.expiresAt > Date.now();
};

const getFromCache = async (key: string) => {
  const entry = getCacheEntry(key);
  if (!entry) return null;
  if (!isCacheEntryValid(entry)) {
    deleteCacheEntry(key);
    return null;
  }
  return entry.data;
};

const setInCache = async (key: string, data: any) => {
  setCacheEntry(key, data);
};

const clearCache = async () => {
  Object.keys(cache).forEach((key) => deleteCacheEntry(key));
};

const cacheMiddleware = async (key: string, fn: () => any) => {
  const cachedData = await getFromCache(key);
  if (cachedData) return cachedData;
  const data = await fn();
  await setInCache(key, data);
  return data;
};

export { cacheMiddleware, clearCache };

// Example usage:
// const data = await cacheMiddleware('books', async () => {
//   return prisma.book.findMany();
// });