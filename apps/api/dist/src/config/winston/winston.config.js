"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const winston_1 = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const customFormat = winston_1.format.printf(({ timestamp, level, message, stack, context }) => {
    const base = `[${timestamp}]${context ? ` [${context}]` : ''} ${level}:`;
    const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return stack ? `${base} ${msg}\n${stack}` : `${base} ${msg}`;
});
exports.winstonConfig = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), customFormat),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize({ all: true }), customFormat),
        }),
        new DailyRotateFile({
            filename: 'combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston_1.format.combine(winston_1.format.uncolorize(), winston_1.format.json()),
        }),
        new DailyRotateFile({
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error',
            format: winston_1.format.combine(winston_1.format.uncolorize(), winston_1.format.json()),
        }),
    ],
});
//# sourceMappingURL=winston.config.js.map