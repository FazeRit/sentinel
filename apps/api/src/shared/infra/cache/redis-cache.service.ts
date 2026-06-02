import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheStoragePort } from 'src/shared/application/ports/cache-storage.port';

@Injectable()
export class RedisCacheService
  implements CacheStoragePort, OnModuleInit, OnModuleDestroy
{
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      lazyConnect: true,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.redis.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  async incr(key: string, ttl: number): Promise<number> {
    const count = await this.redis.incr(key);

    if (count === 1) await this.redis.expire(key, ttl);

    return count;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
