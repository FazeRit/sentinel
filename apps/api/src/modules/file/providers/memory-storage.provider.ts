import { Provider } from '@nestjs/common';
import { MEMORY_STORAGE_READ_PORT } from '../application/ports/memory-storage-read.port';
import { LocalStorageReadService } from '../infra/services/local-storage-read.service';
import { MEMORY_STORAGE_WRITE_PORT } from '../application/ports/memory-storage-write.port';
import { LocalStorageWriteService } from '../infra/services/local-storage-write.service';

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
