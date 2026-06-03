import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CACHE_STORAGE_PORT,
  CacheStoragePort,
} from '../../application/ports/cache-storage.port';
import {
  IThrottleOptions,
  THROTTLE_METADATA_KEY,
} from '../decorators/custom-throttle.decorator';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  private readonly CACHE_THROTTLE_KEY: string = 'throttle';

  constructor(
    private reflector: Reflector,
    @Inject(CACHE_STORAGE_PORT)
    private readonly cacheStorage: CacheStoragePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const throttleOptions = this.reflector.getAllAndOverride<IThrottleOptions>(
      THROTTLE_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!throttleOptions) return true;

    const { limit, ttl } = throttleOptions;

    const ip = request.ip;

    const handlerName = context.getHandler().name;

    const cacheKey = `${this.CACHE_THROTTLE_KEY}:${ip}:${handlerName}`;

    const currentCount = await this.cacheStorage.incr(cacheKey, ttl);

    if (currentCount > limit) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
