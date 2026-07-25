import authService from "./auth.service.js";
import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/responses/ApiResponse.js";
import AppError from "../../shared/errors/AppError.js";
import ErrorCodes from "../../shared/errors/ErrorCodes.js";
import { AUTH_CONSTANTS } from "./auth.constants.js";

const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: AUTH_CONSTANTS.ACCESS_COOKIE_MAX_AGE,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: AUTH_CONSTANTS.REFRESH_COOKIE_MAX_AGE,
  });
};

const clearTokenCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return ApiResponse.created(
    res,
    user,
    "User registered successfully. Please verify your account with the OTP sent to your email.",
  );
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  return ApiResponse.success(res, { user }, "Logged in successfully");
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw AppError.unauthorized(
      "Authentication session expired. Please log in again.",
      ErrorCodes.COMMON.UNAUTHORIZED,
    );
  }

  const { user, accessToken, refreshToken } =
    await authService.refreshSession(token);
  setTokenCookies(res, accessToken, refreshToken);

  return ApiResponse.success(res, { user }, "Session refreshed successfully");
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await authService.logout(token);
  }
  clearTokenCookies(res);
  return ApiResponse.success(res, null, "Logged out successfully");
});

const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  return ApiResponse.success(
    res,
    null,
    "Email address verified successfully. Your account is now active!",
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  return ApiResponse.success(
    res,
    null,
    "If an active account with that email exists, a verification code has been dispatched.",
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  return ApiResponse.success(
    res,
    null,
    "Password successfully reset. Please log in using your new credentials.",
  );
});

const googleLogin = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.googleLogin(
    req.body,
  );

  setTokenCookies(res, accessToken, refreshToken);

  return ApiResponse.success(
    res,
    { user },
    "Logged in via Google successfully",
  );
});

export default {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
};
