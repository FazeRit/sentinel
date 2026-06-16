import { Provider } from '@nestjs/common';
import { MEMORY_STORAGE_READ_PORT } from '../application/ports/storage/file-memory-storage-read.port';
import { MEMORY_STORAGE_WRITE_PORT } from '../application/ports/storage/memory-storage-write.port';
import { LocalStorageWriteService } from '../infra/services/local-storage/local-storage-write.service';
import { LocalStorageReadService } from '../infra/services/local-storage/local-storage-read.service';

export const memoryStorageProviders: Array<Provider> = [
  {
    provide: MEMORY_STORAGE_READ_PORT,
    useClass: LocalStorageReadService,
  },
  {
    provide: MEMORY_STORAGE_WRITE_PORT,
    useClass: LocalStorageWriteService,
  },
];
