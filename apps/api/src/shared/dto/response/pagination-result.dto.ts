import { ApiPaginationMetaResponseDto } from './api-paginition-meta-response.dto';

export class PaginationResult<T> {
  items: Array<T>;
  meta: ApiPaginationMetaResponseDto;
}
