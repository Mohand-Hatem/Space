import { Router } from "express";
import authController from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from "./auth.validation.js";
import validateRequest from "../../middlewares/validateRequest.middleware.js";

const router = Router();

// POST /api/v1/auth/register - Onboard a new local user account
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

// POST /api/v1/auth/login - Authenticate credentials & attach HTTP-only session cookies
router.post("/login", validateRequest(loginSchema), authController.login);

// POST /api/v1/auth/refresh - Automatic background token rotation via HTTP-only cookies
router.post("/refresh", authController.refresh);

// POST /api/v1/auth/logout - Terminate session & clear HTTP-only browser vault cookies
router.post("/logout", authController.logout);

// POST /api/v1/auth/verify-email - Confirm 6-digit OTP code to activate account
router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  authController.verifyEmail,
);

// POST /api/v1/auth/forgot-password - Request self-service 6-digit recovery OTP
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);

// POST /api/v1/auth/reset-password - Submit OTP and brand new password to recover account
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);

// POST /api/v1/auth/google - One-click OAuth ID Token exchange & HTTP-Only cookie sign-in
router.post(
  "/google",
  validateRequest(googleAuthSchema),
  authController.googleLogin,
);

export default router;
