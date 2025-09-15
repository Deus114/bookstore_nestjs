import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';

function createLogger(folderName: string | null): winston.Logger {
  const logDir =
    folderName !== null
      ? path.join(__dirname, '../../../logs', folderName)
      : path.join(__dirname, '../../../logs/general');

  // Tự động tạo folder nếu chưa tồn tại
  fs.mkdirSync(logDir, { recursive: true });

  function createDailyRotateTransport(level: string) {
    return new winston.transports.DailyRotateFile({
      filename: path.join(logDir, '%DATE%', `${level}.log`),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      level,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    });
  }

  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      createDailyRotateTransport('error'),
      createDailyRotateTransport('info'),
      createDailyRotateTransport('debug'),
    ],
  });
}

// Tạo từng logger theo folder name
export const generalLogger = createLogger(null);
export const authLogger = createLogger('auth');
export const ghnLogger = createLogger('ghn');
export const fcmLogger = createLogger('fcm');
export const videoLogger = createLogger('video');
export const cachingLogger = createLogger('caching');
export const ninePayLogger = createLogger('9pay');
export const openAILogger = createLogger('open-ai');
export const orderLogger = createLogger('order');
export const workerLogger = createLogger('worker');
export const taskLogger = createLogger('task');
