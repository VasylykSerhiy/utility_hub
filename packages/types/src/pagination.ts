export interface PaginateOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: T[];
}
