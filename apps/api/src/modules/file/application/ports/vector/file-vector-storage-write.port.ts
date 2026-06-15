import { IFileVectorPayload } from './file-vector-storage-read.port';

export const FILE_VECTOR_STORAGE_WRITE_PORT = Symbol(
  'file-vector-storage-write',
);

export interface IFileVector {
  id: string;
  vector: Array<number>;
  payload: IFileVectorPayload;
}

export abstract class FileVectorStorageWritePort {
  abstract saveFile(file: IFileVector): Promise<void>;
  abstract saveFiles(files: Array<IFileVector>): Promise<void>;
  abstract deleteFile(id: string): Promise<void>;
  abstract deleteFiles(ids: Array<string>): Promise<void>;
}
