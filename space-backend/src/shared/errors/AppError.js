import HttpStatus from "../../constants/httpStatus.js";
import ErrorCodes from "./ErrorCodes.js";

class AppError extends Error {
  constructor(
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code = ErrorCodes.COMMON.INTERNAL_SERVER_ERROR,
    details = [],
  ) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    this.code = code;

    this.details = details;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, code, details = []) {
    return new AppError(message, HttpStatus.BAD_REQUEST, code, details);
  }

  static unauthorized(message, code) {
    return new AppError(message, HttpStatus.UNAUTHORIZED, code);
  }

  static forbidden(message, code) {
    return new AppError(message, HttpStatus.FORBIDDEN, code);
  }

  static notFound(message, code) {
    return new AppError(message, HttpStatus.NOT_FOUND, code);
  }

  static conflict(message, code) {
    return new AppError(message, HttpStatus.CONFLICT, code);
  }

  static internal(message = "Internal Server Error") {
    return new AppError(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.COMMON.INTERNAL_SERVER_ERROR,
    );
  }
}

export default AppError;
