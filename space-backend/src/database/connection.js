import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../shared/logger/logger.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.uri);
    logger.info("✅ MongoDB Connected");
  } catch (error) {
    logger.error("❌ MongoDB Connection Failed");
    logger.error(error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠ MongoDB Disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("✅ MongoDB Reconnected");
});

export default connectDatabase;
