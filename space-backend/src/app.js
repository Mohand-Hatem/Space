import express from "express";
import morgan from "morgan";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import authModule from "./modules/auth/index.js";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Space APP",
  });
});

app.use("/api/v1/auth", authModule.routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;
