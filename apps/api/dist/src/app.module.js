"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./config/winston/winston.config");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./infra/prisma/prisma.module");
const file_module_1 = require("./modules/file/file.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            throttler_1.ThrottlerModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nest_winston_1.WinstonModule.forRoot(winston_config_1.winstonConfig),
            file_module_1.FileModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.CatchEverythingFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.ClassSerializerInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map