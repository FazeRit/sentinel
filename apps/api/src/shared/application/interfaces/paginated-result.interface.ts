export interface PaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
  totalItems: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
