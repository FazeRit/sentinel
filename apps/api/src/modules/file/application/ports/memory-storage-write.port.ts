export const MEMORY_STORAGE_WRITE_PORT = Symbol('memory-storage-write-port');

export abstract class MemoryStorageWritePort {
  abstract upload(fileId: string, file: Express.Multer.File): Promise<string>;
  abstract delete(storagePath: string): Promise<void>;
}
