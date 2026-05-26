import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { access } from 'fs/promises';
import { createReadStream } from 'fs';
import { MemoryStorageReadPort } from 'src/modules/file/application/ports/memory-storage-read.port';

@Injectable()
export class LocalStorageReadService implements MemoryStorageReadPort {
  async find(storagePath: string): Promise<Readable> {
    await access(storagePath);

    return createReadStream(storagePath);
  }
}
