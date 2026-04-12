import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CatchEverythingFilter } from './shared/filters/http-exception.filter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston/winston.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
