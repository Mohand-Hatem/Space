import mongoose from "mongoose";

export const startTransaction = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
};
