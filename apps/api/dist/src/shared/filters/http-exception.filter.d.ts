import { ExceptionFilter, ArgumentsHost, LoggerService } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
export declare class CatchEverythingFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost, logger: LoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private getErrorMessage;
}
