import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_WRITE_PORT = Symbol('file-write-port');

export abstract class FileWritePort {
  abstract save(file: FileEntity): Promise<void>;
  abstract update(file: FileEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByLabId(labId: string): Promise<void>;
}
