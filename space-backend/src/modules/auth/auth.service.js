import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import authRepository from "./auth.repository.js";
import { AUTH_CONSTANTS } from "./auth.constants.js";
import AppError from "../../shared/errors/AppError.js";
import ErrorCodes from "../../shared/errors/ErrorCodes.js";
import { userConstants } from "../users/index.js";
import config from "../../config/index.js";

const generateNumericOtp = (length = AUTH_CONSTANTS.OTP_LENGTH || 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = crypto.randomInt(min, max + 1).toString();

  console.log("\n🛠️ [DEV AUDIT] GENERATED OTP SECURITY CODE:", otp, "\n");

  return otp;
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role, status: user.status },
    config.jwt.accessSecret,
    {
      expiresIn:
        config.jwt.accessExpiresIn || AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    },
  );

  const refreshToken = jwt.sign({ sub: user._id }, config.jwt.refreshSecret, {
    expiresIn:
      config.jwt.refreshExpiresIn || AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const verifyGoogleIdToken = async (idToken) => {
  try {
    const googleClient = new OAuth2Client(config.app.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.app.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    throw AppError.unauthorized(
      "Invalid or expired Google authentication credentials.",
      ErrorCodes.AUTH.INVALID_CREDENTIALS,
    );
  }
};

const register = async (payload) => {
  const { email, password, firstName, lastName } = payload;

  const isTaken = await authRepository.emailExists(email);
  if (isTaken) {
    throw AppError.conflict(
      "An account associated with this email address already exists.",
      ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS,
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS,
  );

  const initialOtp = generateNumericOtp();
  console.log("\n🛠️ DEV TESTING - YOUR 6-DIGIT OTP CODE IS:", initialOtp, "\n");

  const otpExpiry = new Date(
    Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000,
  );

  const newAccountData = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    provider: userConstants.AUTH_PROVIDERS.LOCAL,
    status: userConstants.USER_STATUS.PENDING_VERIFICATION,
    emailVerificationOtp: initialOtp,
    emailVerificationOtpExpires: otpExpiry,
  };

  return await authRepository.createUser(newAccountData);
};

const login = async (payload) => {
  const { email, password } = payload;
  const user = await authRepository.findUserByEmail(email, {
    select: "+password",
  });

  if (!user || !user.password) {
    throw AppError.unauthorized(
      "Invalid email or password",
      ErrorCodes.AUTH.INVALID_CREDENTIALS,
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw AppError.unauthorized(
      "Invalid email or password",
      ErrorCodes.AUTH.INVALID_CREDENTIALS,
    );
  }

  if (user.status === userConstants.USER_STATUS.SUSPENDED) {
    throw AppError.forbidden(
      "Your account has been suspended.",
      ErrorCodes.COMMON.FORBIDDEN,
    );
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await authRepository.updateUserSession(user._id, {
    refreshToken,
    lastLoginAt: new Date(),
  });

  const sanitizedUser = user.toObject ? user.toObject() : { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.refreshToken;
  delete sanitizedUser.isDeleted;

  return { user: sanitizedUser, accessToken, refreshToken };
};

const refreshSession = async (cookieToken) => {
  let decoded;
  try {
    decoded = jwt.verify(cookieToken, config.jwt.refreshSecret);
  } catch (error) {
    throw AppError.unauthorized(
      "Session expired. Please log in again.",
      ErrorCodes.AUTH.TOKEN_EXPIRED,
    );
  }

  const user = await authRepository.findUserWithToken(decoded.sub);
  if (!user || user.refreshToken !== cookieToken) {
    throw AppError.unauthorized(
      "Invalid session token. Please log in again.",
      ErrorCodes.AUTH.INVALID_TOKEN,
    );
  }

  if (user.status === userConstants.USER_STATUS.SUSPENDED) {
    throw AppError.forbidden(
      "Your account has been suspended.",
      ErrorCodes.COMMON.FORBIDDEN,
    );
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await authRepository.updateUserSession(user._id, { refreshToken });

  const sanitizedUser = user.toObject ? user.toObject() : { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.refreshToken;
  delete sanitizedUser.isDeleted;

  return { user: sanitizedUser, accessToken, refreshToken };
};

const logout = async (cookieToken) => {
  let decoded;
  try {
    decoded = jwt.verify(cookieToken, config.jwt.refreshSecret);
  } catch (err) {
    decoded = jwt.decode(cookieToken);
  }

  if (decoded && decoded.sub) {
    await authRepository.clearUserSession(decoded.sub);
  }
  return { success: true };
};

const verifyEmail = async (payload) => {
  const { email, otp } = payload;
  const user = await authRepository.findUserForVerification(email);

  if (!user) {
    throw AppError.badRequest(
      "Invalid email address or verification code.",
      ErrorCodes.AUTH.INVALID_OTP,
    );
  }

  if (
    user.isEmailVerified &&
    user.status === userConstants.USER_STATUS.ACTIVE
  ) {
    return { success: true };
  }

  if (
    !user.emailVerificationOtp ||
    user.emailVerificationOtp !== otp ||
    new Date() > user.emailVerificationOtpExpires
  ) {
    throw AppError.badRequest(
      "Invalid or expired verification code.",
      ErrorCodes.AUTH.INVALID_OTP,
    );
  }

  await authRepository.updateUserSecurity(user._id, {
    isEmailVerified: true,
    status: userConstants.USER_STATUS.ACTIVE,
    emailVerificationOtp: null,
    emailVerificationOtpExpires: null,
  });

  return { success: true };
};

const forgotPassword = async (payload) => {
  const { email } = payload;
  const user = await authRepository.findUserByEmail(email);

  if (!user || !user.password) {
    return { success: true };
  }

  const recoveryOtp = generateNumericOtp();
  console.log("\n🛠️ DEV TESTING - YOUR 6-DIGIT OTP CODE IS:", initialOtp, "\n");

  const otpExpiry = new Date(
    Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000,
  );

  await authRepository.updateUserSecurity(user._id, {
    passwordResetOtp: recoveryOtp,
    passwordResetOtpExpires: otpExpiry,
  });

  return { success: true };
};

const resetPassword = async (payload) => {
  const { email, otp, newPassword } = payload;
  const user = await authRepository.findUserForPasswordReset(email);

  if (
    !user ||
    !user.passwordResetOtp ||
    user.passwordResetOtp !== otp ||
    new Date() > user.passwordResetOtpExpires
  ) {
    throw AppError.badRequest(
      "Invalid or expired password reset code.",
      ErrorCodes.AUTH.INVALID_OTP,
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS,
  );

  await authRepository.updateUserSecurity(user._id, {
    password: hashedPassword,
    passwordResetOtp: null,
    passwordResetOtpExpires: null,
    refreshToken: null,
  });

  return { success: true };
};

/**
 * Handle Google OAuth Sign-In, profile merging, and session token generation
 */
const googleLogin = async (payload) => {
  const { idToken } = payload;

  // 1. Cryptographically verify signature and extract trusted Google account payload
  const googlePayload = await verifyGoogleIdToken(idToken);
  const {
    email,
    email_verified,
    given_name,
    family_name,
    picture,
    sub: googleId,
  } = googlePayload;

  if (!email_verified || !email) {
    throw AppError.unauthorized(
      "Google account email address is unverified. Please verify your Google identity prior to logging in.",
      ErrorCodes.AUTH.INVALID_CREDENTIALS,
    );
  }

  const cleanEmail = email.toLowerCase();
  let user = await authRepository.findUserByEmail(cleanEmail);

  if (user) {
    // 3A. If existing account is suspended by an admin, halt execution immediately!
    if (user.status === userConstants.USER_STATUS.SUSPENDED) {
      throw AppError.forbidden(
        "Your account has been suspended by an administrator. Please contact technical support.",
        ErrorCodes.COMMON.FORBIDDEN,
      );
    }
    // Note: If user originally registered via local password, Google Sign-In seamlessly authenticates them!
  } else {
    // 3B. Onboard brand-new social user! Auto-activate without requiring local password or OTP loops!
    const newAccountData = {
      email: cleanEmail,
      firstName: given_name || "Space",
      lastName: family_name || "User",
      avatarUrl: picture || null, // Seamlessly capture profile picture from Google!
      provider: userConstants.AUTH_PROVIDERS.GOOGLE,
      googleId: googleId || null,
      isEmailVerified: true, // Google already verified this human identity!
      status: userConstants.USER_STATUS.ACTIVE, // Instantly ACTIVE! Zero onboarding delays!
    };

    user = await authRepository.createUser(newAccountData);
  }

  // 4. Mint cryptographic Space Access & Refresh JWT tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // 5. Update user session records in MongoDB
  await authRepository.updateUserSession(user._id, {
    refreshToken,
    lastLoginAt: new Date(),
  });

  // 6. Sanitize sensitive properties before returning profile data
  const sanitizedUser = user.toObject ? user.toObject() : { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.refreshToken;
  delete sanitizedUser.isDeleted;

  return { user: sanitizedUser, accessToken, refreshToken };
};

export default {
  register,
  login,
  refreshSession,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
};
