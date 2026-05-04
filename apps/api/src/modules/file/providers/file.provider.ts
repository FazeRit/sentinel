import { Provider } from '@nestjs/common';
import { FILE_READ_PORT } from '../application/ports/file-read.port';
import { FileReadRepository } from '../infra/repositories/file-read.repository';
import { FILE_WRITE_PORT } from '../application/ports/file-write.port';
import { FileWriteRepository } from '../infra/repositories/file-write.repository';

export const fileProviders: Array<Provider> = [
  {
    provide: FILE_READ_PORT,
    useClass: FileReadRepository,
  },
  {
    provide: FILE_WRITE_PORT,
    useClass: FileWriteRepository,
  },
];
