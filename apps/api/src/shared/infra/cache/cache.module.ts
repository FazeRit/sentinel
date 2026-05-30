import { Global, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CACHE_STORAGE_PORT } from 'src/shared/application/ports/cache-storage.port';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_STORAGE_PORT,
      useClass: RedisCacheService,
    },
  ],
  exports: [CACHE_STORAGE_PORT],
})
export class CacheModule {}
