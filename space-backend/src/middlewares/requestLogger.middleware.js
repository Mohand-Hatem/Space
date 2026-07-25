import logger from "../shared/logger/logger.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const clientIp = req.ip || req.connection?.remoteAddress || "127.0.0.1";
    logger.info(
      `${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms | IP: ${clientIp}`,
    );
  });

  return next();
};

export default requestLogger;
