import userModule from "../users/index.js";

/**
 * Retrieve a user document by email via the User domain
 */
const findUserByEmail = async (email, options = {}) => {
  return await userModule.repository.findByEmail(email, options);
};

/**
 * Check whether an email is already registered in MongoDB
 */
const emailExists = async (email) => {
  return await userModule.repository.emailExists(email);
};

/**
 * Create and save a brand new user document via the User domain repository
 */
const createUser = async (userData) => {
  return await userModule.repository.create(userData);
};

/**
 * Update user session state (saving Refresh Token and updating lastLoginAt)
 */
const updateUserSession = async (userId, sessionData) => {
  return await userModule.repository.updateById(userId, sessionData);
};

/**
 * Find user by ID while explicitly retrieving the secret refreshToken field
 */
const findUserWithToken = async (userId) => {
  return await userModule.repository.findById(userId, {
    select: "+refreshToken",
  });
};

/**
 * Server-side session revocation: nullifies stored refresh tokens in MongoDB
 */
const clearUserSession = async (userId) => {
  return await userModule.repository.updateById(userId, { refreshToken: null });
};

/**
 * Find user by email while explicitly unblinding email verification OTP secrets
 */
const findUserForVerification = async (email) => {
  return await userModule.repository.findByEmail(email, {
    select: "+emailVerificationOtp +emailVerificationOtpExpires",
  });
};

/**
 * Find user by email while explicitly unblinding password recovery OTP secrets
 */
const findUserForPasswordReset = async (email) => {
  return await userModule.repository.findByEmail(email, {
    select: "+passwordResetOtp +passwordResetOtpExpires",
  });
};

/**
 * Update user security credentials (OTPs, active verification flags, passwords)
 */
const updateUserSecurity = async (userId, securityData) => {
  return await userModule.repository.updateById(userId, securityData);
};

// Exporting pure functional repository helpers
export default {
  findUserByEmail,
  emailExists,
  createUser,
  updateUserSession,
  findUserWithToken,
  clearUserSession,
  findUserForVerification,
  findUserForPasswordReset,
  updateUserSecurity,
};
