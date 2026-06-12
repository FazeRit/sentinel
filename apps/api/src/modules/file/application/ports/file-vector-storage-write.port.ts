import { FileVectorPayload } from './file-vector-storage-read.port';

export const FILE_VECTOR_STORAGE_WRITE_PORT = Symbol(
  'file-vector-storage-write',
);

export interface FileVector {
  id: string;
  vector: Array<number>;
  payload: FileVectorPayload;
}

export abstract class FileVectorStorageWritePort {
  abstract saveFile(file: FileVector): Promise<void>;
  abstract saveFiles(files: Array<FileVector>): Promise<void>;
  abstract deleteFile(id: string): Promise<void>;
  abstract deleteFiles(ids: Array<string>): Promise<void>;
}
