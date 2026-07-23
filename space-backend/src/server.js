import app from "./app.js";
import config from "./config/index.js";
import connectDatabase from "./database/connection.js";
import logger from "./shared/logger/logger.js";

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(config.app.port, () => {
      logger.info(`🚀 ${config.app.name} running on port ${config.app.port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
