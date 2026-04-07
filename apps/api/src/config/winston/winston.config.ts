import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const customFormat = format.printf(
  ({ timestamp, level, message, stack, context }) => {
    const base = `[${timestamp}]${context ? ` [${context}]` : ''} ${level}:`;
    const msg =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;

    return stack ? `${base} ${msg}\n${stack}` : `${base} ${msg}`;
  },
);

export const winstonConfig = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), customFormat),
    }),

    new DailyRotateFile({
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs',
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.uncolorize(), format.json()),
    }),

    new DailyRotateFile({
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: format.combine(format.uncolorize(), format.json()),
    }),
  ],
});
