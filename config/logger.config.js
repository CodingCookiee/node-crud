import winston from "winston";
import path from "path";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // Error logs file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // Combined logs file
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export const morganStream = {
  write: (message) => logger.http(message.trim()),
};
