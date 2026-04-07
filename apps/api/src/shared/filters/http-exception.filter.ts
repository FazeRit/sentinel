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
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception);

    const responseBody = new ApiResponseDto<null>({
      data: null,
      status: status,
      message: message,
      timestamp: new Date(),
      path: request.url,
    });

    this.logger.error(message);

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private getErrorMessage(exception: unknown): string {
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

    return exception instanceof Error
      ? exception.message
      : 'Internal server error';
  }
}
