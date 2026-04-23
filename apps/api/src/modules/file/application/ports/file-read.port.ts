import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_READ_PORT = Symbol('file-read-port');

export abstract class FileReadPort {
  abstract findById(id: string): Promise<FileEntity | null>;
  abstract findFiles(
    limit: number,
    labId?: string,
    ownerId?: string,
    cursor?: string,
  ): Promise<PaginationResult<FileEntity>>;
}
