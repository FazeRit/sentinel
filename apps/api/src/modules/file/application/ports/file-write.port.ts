import { FileEntity } from '../../domain/entities/file.entity';

export const FILE_WRITE_PORT = Symbol('file-write-port');

export abstract class FileWritePort {
  abstract saveFile(fileEntity: FileEntity): Promise<FileEntity>;
  abstract softDeleteFiles(labId: string, ownerId?: string): Promise<void>;
  abstract hardDeleteFiles(ids: Array<string>): Promise<void>;
}
