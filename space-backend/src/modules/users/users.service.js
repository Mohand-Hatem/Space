import userRepository from "./users.repository.js";
import AppError from "../../shared/errors/AppError.js";
import ErrorCodes from "../../shared/errors/ErrorCodes.js";

const createUser = async (userData) => {
  const isTaken = await userRepository.emailExists(userData.email);
  if (isTaken) {
    throw AppError.conflict(
      "A user with this email already exists",
      ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS,
    );
  }

  return await userRepository.create(userData);
};

const getUserById = async (id, options = {}) => {
  const user = await userRepository.findById(id, options);
  if (!user) {
    throw AppError.notFound(
      "User account not found",
      ErrorCodes.USER.USER_NOT_FOUND,
    );
  }
  return user;
};

const getUserByEmail = async (email, options = {}) => {
  const user = await userRepository.findByEmail(email, options);
  if (!user) {
    throw AppError.notFound(
      "User account not found",
      ErrorCodes.USER.USER_NOT_FOUND,
    );
  }
  return user;
};

const updateUser = async (id, updateData) => {
  await getUserById(id);
  return await userRepository.updateById(id, updateData);
};

const deleteUser = async (id) => {
  await getUserById(id);
  return await userRepository.softDelete(id);
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
