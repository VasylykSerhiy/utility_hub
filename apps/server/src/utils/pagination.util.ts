type PaginationDefaults = {
  readonly page: number;
  readonly pageSize: number;
  readonly maxPageSize: number;
};

const DEFAULTS: PaginationDefaults = {
  page: 1,
  pageSize: 10,
  maxPageSize: 50,
};

export const parsePagination = (
  query: { readonly page?: unknown; readonly pageSize?: unknown },
  overrides: Partial<PaginationDefaults> = {},
): { page: number; pageSize: number } => {
  const config = { ...DEFAULTS, ...overrides };
  const page = Math.max(1, Number(query.page) || config.page);
  const pageSize = Math.min(
    config.maxPageSize,
    Math.max(1, Number(query.pageSize) || config.pageSize),
  );

  return { page, pageSize };
};
