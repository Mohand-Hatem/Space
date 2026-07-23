import mongoose from "mongoose";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import logger from "../shared/logger/logger.js";
import AppError from "../shared/errors/AppError.js";
import ApiResponse from "../shared/responses/ApiResponse.js";
import ErrorCodes from "../shared/errors/ErrorCodes.js";
import HttpStatus from "../constants/httpStatus.js";

const errorMiddleware = (error, req, res, next) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    return ApiResponse.error(res, {
      statusCode: error.statusCode,

      message: error.message,

      code: error.code,

      details: error.details,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.BAD_REQUEST,

      message: "Validation Failed",

      code: ErrorCodes.COMMON.VALIDATION_ERROR,

      details: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // Invalid ObjectId

  if (error instanceof mongoose.Error.CastError) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.NOT_FOUND,

      message: "Resource not found",

      code: ErrorCodes.COMMON.NOT_FOUND,
    });
  }

  if (error.code === 11000) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.CONFLICT,

      message: "Duplicate value",

      code: ErrorCodes.COMMON.CONFLICT,

      details: Object.keys(error.keyPattern),
    });
  }

  // JWT Expired

  if (error instanceof jwt.TokenExpiredError) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.UNAUTHORIZED,

      message: "Token expired",

      code: ErrorCodes.AUTH.TOKEN_EXPIRED,
    });
  }

  // Invalid JWT

  if (error instanceof jwt.JsonWebTokenError) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.UNAUTHORIZED,

      message: "Invalid token",

      code: ErrorCodes.AUTH.INVALID_TOKEN,
    });
  }

  // Zod

  if (error instanceof ZodError) {
    return ApiResponse.error(res, {
      statusCode: HttpStatus.BAD_REQUEST,

      message: "Validation Failed",

      code: ErrorCodes.COMMON.VALIDATION_ERROR,

      details: error.errors.map((err) => ({
        field: err.path.join("."),

        message: err.message,
      })),
    });
  }

  return ApiResponse.error(res, {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,

    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal Server Error",

    code: ErrorCodes.COMMON.INTERNAL_SERVER_ERROR,

    details: process.env.NODE_ENV === "development" ? [error.stack] : [],
  });
};

export default errorMiddleware;
