import AppError from "../shared/errors/AppError.js";
import ErrorCodes from "../shared/errors/ErrorCodes.js";

const notFoundMiddleware = (req, res, next) => {
  next(
    AppError.notFound(
      `Route ${req.originalUrl} not found`,

      ErrorCodes.COMMON.NOT_FOUND,
    ),
  );
};

export default notFoundMiddleware;
