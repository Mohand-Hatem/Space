import User from "./users.model.js";
import { USER_STATUS } from "./users.constants.js";

const create = async (userData) => {
  const user = await User.create(userData);

  return findById(user._id);
};

const findById = async (id, options = {}) => {
  const query = User.findOne({ _id: id, isDeleted: false });
  if (options.select) {
    query.select(options.select);
  }
  return await query.exec();
};

const findByEmail = async (email, options = {}) => {
  const query = User.findOne({ email: email.toLowerCase(), isDeleted: false });
  if (options.select) {
    query.select(options.select);
  }
  return await query.exec();
};

const findByGoogleId = async (googleId) => {
  return await User.findOne({ googleId, isDeleted: false }).exec();
};

const updateById = async (id, updateData) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updateData },
    { new: true, runValidators: true },
  ).exec();
};

const softDelete = async (id) => {
  return await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isDeleted: true,
        status: USER_STATUS.DELETED,
        refreshToken: null, // Revoke active JWT sessions on account deletion
      },
    },
    { new: true },
  ).exec();
};

const emailExists = async (email) => {
  const count = await User.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

export default {
  create,
  findById,
  findByEmail,
  findByGoogleId,
  updateById,
  softDelete,
  emailExists,
};
