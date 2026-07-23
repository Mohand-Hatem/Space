export const getPagination = ({ page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};
