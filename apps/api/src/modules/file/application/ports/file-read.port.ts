import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_READ_PORT = Symbol('file-read-port');

export abstract class FileReadPort {
  abstract findById(id: string): Promise<FileEntity | null>;
  abstract findByLabId(labId: string): Promise<Array<FileEntity> | null>;
}
