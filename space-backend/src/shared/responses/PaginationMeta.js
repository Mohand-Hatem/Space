class PaginationMeta {
  constructor({ page, limit, total }) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}

export default PaginationMeta;
