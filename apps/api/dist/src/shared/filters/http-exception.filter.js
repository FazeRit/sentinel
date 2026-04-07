"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchEverythingFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const api_response_dto_1 = require("../dto/response/api-response.dto");
const nest_winston_1 = require("nest-winston");
let CatchEverythingFilter = class CatchEverythingFilter {
    constructor(httpAdapterHost, logger) {
        this.httpAdapterHost = httpAdapterHost;
        this.logger = logger;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = this.getErrorMessage(exception);
        const responseBody = new api_response_dto_1.ApiResponseDto({
            data: null,
            status: status,
            message: message,
            timestamp: new Date(),
            path: request.url,
        });
        this.logger.error(message);
        httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
    getErrorMessage(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'object' && response !== null) {
                const message = response.message;
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
};
exports.CatchEverythingFilter = CatchEverythingFilter;
exports.CatchEverythingFilter = CatchEverythingFilter = __decorate([
    (0, common_1.Catch)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost, Object])
], CatchEverythingFilter);
//# sourceMappingURL=http-exception.filter.js.map