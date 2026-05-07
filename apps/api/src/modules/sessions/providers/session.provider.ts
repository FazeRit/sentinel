import { Provider } from '@nestjs/common';
import { SESSION_READ_PORT } from '../application/ports/session-read.port';
import { SESSION_WRITE_PORT } from '../application/ports/session-write.port';
import { SessionReadRepository } from '../infra/repositories/session-read.repository';
import { SessionWriteRepository } from '../infra/repositories/session-write.repository ';

export const sessionProviders: Array<Provider> = [
  {
    provide: SESSION_READ_PORT,
    useClass: SessionReadRepository,
  },
  {
    provide: SESSION_WRITE_PORT,
    useClass: SessionWriteRepository,
  },
];
