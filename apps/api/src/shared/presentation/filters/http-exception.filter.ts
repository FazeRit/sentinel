import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ApiResponseDto } from '../dto/response/api-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const userMessage = this.getUserFriendlyMessage(exception);

    const { method, originalUrl, ip } = request;
    const userAgent = request.get
      ? request.get('user-agent') || 'Unknown'
      : 'Unknown';

    const logMessage =
      exception instanceof Error
        ? `[Exception] ${method} ${originalUrl} ${status} - Error: ${exception.message} - IP: ${ip} - UA: ${userAgent}\n${exception.stack}`
        : `[Exception] ${method} ${originalUrl} ${status} - Error: ${typeof exception === 'string' ? exception : JSON.stringify(exception)} - IP: ${ip} - UA: ${userAgent}`;

    this.logger.error(logMessage);

    const responseBody = new ApiResponseDto<null>({
      data: null,
      status: status,
      message: userMessage,
      timestamp: new Date(),
      path: request.url,
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private getUserFriendlyMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const message = (response as any).message;

        return Array.isArray(message)
          ? message.join(', ')
          : message || exception.message;
      }
      return exception.message;
    }

    return 'Internal server error';
  }
}
