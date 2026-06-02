import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CACHE_STORAGE_PORT,
  CacheStoragePort,
} from 'src/shared/application/ports/cache-storage.port';
import { HTTP_WRITE_METHODS } from 'src/shared/constants/http.constants';
import { IDEMPOTENCY_KEY_STATUS } from '../constants/idempotency.constants';

@Injectable()
export class IdempotencyKeyInterceptor implements NestInterceptor {
  private readonly CACHE_IDEMPOTENCY_KEY: string = 'idempotency';

  constructor(
    @Inject(CACHE_STORAGE_PORT)
    private readonly cacheStorage: CacheStoragePort,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (!HTTP_WRITE_METHODS.includes(request.method)) {
      return next.handle();
    }

    const idempotencyKey =
      request.headers['idempotency-key'] ||
      request.headers['x-idempotency-key'];

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return next.handle();
    }

    const cacheKey = `${this.CACHE_IDEMPOTENCY_KEY}:${idempotencyKey}`;
    const cached = await this.cacheStorage.get(cacheKey);

    const statusActions: Record<string, () => never> = {
      PENDING: () => {
        throw new ConflictException(
          'A duplicate request with the same idempotency key is already in progress.',
        );
      },
      COMPLETED: () => {
        throw new ConflictException(
          'This request has already been successfully processed.',
        );
      },
    };

    if (cached && statusActions[cached]) {
      statusActions[cached]();
    }

    await this.cacheStorage.set(cacheKey, IDEMPOTENCY_KEY_STATUS.PENDING, 60);

    return next.handle().pipe(
      tap({
        next: async () => {
          try {
            await this.cacheStorage.set(
              cacheKey,
              IDEMPOTENCY_KEY_STATUS.COMPLETED,
              86400,
            );
          } catch {}
        },
        error: async () => {
          try {
            await this.cacheStorage.delete(cacheKey);
          } catch {}
        },
      }),
    );
  }
}
