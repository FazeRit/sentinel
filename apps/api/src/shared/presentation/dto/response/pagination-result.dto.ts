import { ApiPaginationMetaResponseDto } from './api-pagination-meta-response.dto';

export class PaginationResult<T> {
  items: Array<T>;
  meta: ApiPaginationMetaResponseDto;
}
