import { Readable } from 'stream';

export const MEMORY_STORAGE_READ_PORT = Symbol('memory-storage-read-port');

export abstract class MemoryStorageReadPort {
  abstract find(storagePath: string): Promise<Readable>;
}
