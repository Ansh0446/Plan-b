/**
 * Offset-based pagination helper. Kept deliberately generic (not tied to
 * any one entity) so `resources.repository.ts`, `orders.repository.ts`,
 * etc. all paginate identically instead of each re-deriving skip/take
 * math — the exact kind of drift Phase 1 §8's "a convention, once set,
 * applies retroactively" rule exists to prevent.
 */

export interface PaginationParams {
  /** 1-indexed page number. */
  page?: number;
  /** Rows per page. */
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Converts 1-indexed page/pageSize into Prisma's `skip`/`take`. */
export function toSkipTake(params: PaginationParams): { skip: number; take: number } {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/** Wraps a `findMany` result + total count into a consistent paginated envelope. */
export function toPaginatedResult<T>(
  items: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
