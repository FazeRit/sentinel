export class ApiPaginationMetaResponseDto {
  nextCursor: string | null;
  hasNextPage: boolean;
  totalItems: number;

  constructor(nextCursor?: string, hasNextPage?: boolean, totalItems?: number) {
    this.nextCursor = nextCursor || null;
    this.hasNextPage = hasNextPage || false;
    this.totalItems = totalItems || 0;
  }
}
