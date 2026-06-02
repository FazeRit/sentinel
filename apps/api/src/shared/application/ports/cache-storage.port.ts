export const CACHE_STORAGE_PORT = Symbol('cache-storage');

export abstract class CacheStoragePort {
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string, ttlSeconds: number): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract incr(key: string, ttl: number): Promise<number>;
}
