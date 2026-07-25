import winston from "winston";

const { combine, timestamp, colorize, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message) : message;
  const metaString =
    Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

  return `[${timestamp}] ${level}: ${formattedMessage}${metaString}`;
});

const logger = winston.createLogger({
  level: "info",

  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    colorize(),
    logFormat,
  ),

  transports: [new winston.transports.Console()],
});

export default logger;
