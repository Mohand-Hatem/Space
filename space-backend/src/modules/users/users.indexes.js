const applyUserIndexes = (userSchema) => {
  // 1. Enforce absolute email uniqueness across all accounts in MongoDB
  userSchema.index({ email: 1 }, { unique: true });

  // 2. Optimize OAuth lookups by Google ID (sparse since standard accounts won't have this field)
  userSchema.index({ googleId: 1 }, { sparse: true });

  // 3. Composite index to optimize frequent queries filtering by account status and deletion flags
  userSchema.index({ status: 1, isDeleted: 1 });

  // 4. Chronological indexing for admin dashboards and pagination sorting
  userSchema.index({ createdAt: -1 });
};

export default applyUserIndexes;
