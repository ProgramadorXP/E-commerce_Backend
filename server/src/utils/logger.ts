import winston from 'winston';
import { env } from '@/config/config';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Define custom levels for e-commerce needs (optional, standard levels are usually enough)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about our colors
winston.addColors(colors);

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level.toUpperCase().padEnd(7)}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // capture stack trace
    logFormat,
  ),
  transports: [
    // 1. Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // 2. Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 3. If we're in development, also log to the console with colors
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), align(), logFormat),
    }),
  );
}

// 4. Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
