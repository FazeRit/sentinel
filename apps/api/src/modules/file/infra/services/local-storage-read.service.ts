import { Injectable } from '@nestjs/common';
import { MemoryStorageReadPort } from '../../application/ports/memory-storage-read.port';
import { Readable } from 'stream';
import { access } from 'fs/promises';
import { createReadStream } from 'fs';

@Injectable()
export class LocalStorageReadService implements MemoryStorageReadPort {
  async find(storagePath: string): Promise<Readable> {
    await access(storagePath);

    return createReadStream(storagePath);
  }
}
