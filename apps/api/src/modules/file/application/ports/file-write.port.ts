import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_WRITE_PORT = Symbol('file-write-port');

export abstract class FileWritePort {
  abstract save(fileEntity: FileEntity): Promise<void>;
  abstract update(fileEntity: FileEntity): Promise<void>;
  abstract deleteFile(id: string): Promise<void>;
  abstract deleteFiles(labId: string, ownerId?: string): Promise<void>;
}
