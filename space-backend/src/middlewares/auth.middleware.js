import jwt from "jsonwebtoken";
import config from "../config/index.js";
import asyncHandler from "../shared/asyncHandler.js";
import AppError from "../shared/errors/AppError.js";
import ErrorCodes from "../shared/errors/ErrorCodes.js";
import userModule from "../modules/users/index.js";

/**
 * Authentication Guard: Strictly verifies HTTP-Only Cookie token integrity & attaches active user
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1. Exclusive Security Loop: Extract token STRICTLY from secure HTTP-Only browser cookies!
  const token = req.cookies?.accessToken;

  // 2. Reject access immediately if no valid authenticating cookie exists in browser vault
  if (!token) {
    throw AppError.unauthorized(
      "You are not logged in. Please sign in to access this resource.",
      ErrorCodes.COMMON.UNAUTHORIZED,
    );
  }

  // 3. Cryptographically verify signature and evaluate our 15-minute expiration clock
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    throw AppError.unauthorized(
      "Authentication session expired or invalid. Please log in again.",
      ErrorCodes.AUTH.TOKEN_EXPIRED,
    );
  }

  // 4. Interrogate MongoDB to ensure user account still exists (has not been soft-deleted or removed)
  const user = await userModule.repository.findById(decoded.sub);
  if (!user) {
    throw AppError.unauthorized(
      "The user account associated with this security session no longer exists.",
      ErrorCodes.COMMON.UNAUTHORIZED,
    );
  }

  // 5. Instantaneous Ban Enforcement: Block suspended users immediately!
  if (user.status === userModule.constants.USER_STATUS.SUSPENDED) {
    throw AppError.forbidden(
      "Your account has been suspended by an administrator. Please contact technical support.",
      ErrorCodes.COMMON.FORBIDDEN,
    );
  }

  // 6. Attach verified, active user profile directly onto Express request context and proceed!
  req.user = user;
  return next();
});

/**
 * Authorization Guard (RBAC): Restricts endpoint access exclusively to permitted system roles
 * @param {...string} allowedRoles - Array of allowed user roles (e.g., 'ADMIN', 'SUPER_ADMIN')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Safety verification: guarantee that `protect` middleware executed prior to this guard
    if (!req.user) {
      throw AppError.unauthorized(
        "Authentication check required prior to evaluating authorization role permissions.",
        ErrorCodes.COMMON.UNAUTHORIZED,
      );
    }

    // 2. Evaluate whether the authenticated user's system role matches our permitted list
    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Your user role (${req.user.role}) lacks sufficient permissions to perform this action.`,
        ErrorCodes.COMMON.FORBIDDEN,
      );
    }

    // 3. Permission verified: continue forward into feature controller!
    return next();
  };
};

// Export individual functional guards and unified default namespace
export { protect, authorize };
export default { protect, authorize };
