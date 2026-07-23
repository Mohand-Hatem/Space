import logger from "../shared/logger/logger.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,

      url: req.originalUrl,

      status: res.statusCode,

      duration: `${Date.now() - start} ms`,

      ip: req.ip,
    });
  });

  next();
};

export default requestLogger;
