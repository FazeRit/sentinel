import { PaginatedResult } from 'src/shared/application/interfaces/paginated-result.interface';
import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_READ_PORT = Symbol('file-read-port');

export abstract class FileReadPort {
  abstract findFileById(id: string): Promise<FileEntity | null>;
  abstract findFiles(
    limit?: number,
    labId?: string,
    ownerId?: string,
    cursor?: string,
  ): Promise<PaginatedResult<FileEntity>>;
  abstract findFilesByIds(ids: Array<string>): Promise<FileEntity[]>;
  abstract findExpiredFiles(thresholdDate: Date): Promise<FileEntity[]>;
  abstract countFiles(labId: string, ownerId?: string): Promise<number>;
}
