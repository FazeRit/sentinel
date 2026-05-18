import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_READ_PORT = Symbol('file-read-port');

export abstract class FileReadPort {
  abstract findFileById(id: string): Promise<FileEntity | null>;
  abstract findFiles(
    limit: number,
    labId?: string,
    ownerId?: string,
    cursor?: string,
  ): Promise<PaginationResult<FileEntity>>;
  abstract findFilesByIds(ids: Array<string>): Promise<FileEntity[]>;
  abstract findExpiredFiles(thresholdDate: Date): Promise<FileEntity[]>;
}
