import { Provider } from '@nestjs/common';
import { FILE_VECTOR_STORAGE_READ_PORT } from '../application/ports/file-vector-storage-read.port';
import { FileVectorStorageReadService } from '../infra/services/file-vector-storage/file-vector-storage-read.service';
import { FILE_VECTOR_STORAGE_WRITE_PORT } from '../application/ports/file-vector-storage-write.port';
import { FileVectorStorageWriteService } from '../infra/services/file-vector-storage/file-vector-storage-write.service';

export const fileVectorStorageProviders: Array<Provider> = [
  {
    provide: FILE_VECTOR_STORAGE_READ_PORT,
    useClass: FileVectorStorageReadService,
  },
  {
    provide: FILE_VECTOR_STORAGE_WRITE_PORT,
    useClass: FileVectorStorageWriteService,
  },
];
