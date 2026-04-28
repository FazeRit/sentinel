import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_WRITE_PORT = Symbol('file-write-port');

export abstract class FileWritePort {
  abstract saveFile(fileEntity: FileEntity): Promise<FileEntity>;
  abstract updateFile(fileEntity: FileEntity): Promise<FileEntity>;
  abstract deleteFileById(id: string): Promise<void>;
  abstract deleteFiles(labId: string, ownerId?: string): Promise<void>;
}
