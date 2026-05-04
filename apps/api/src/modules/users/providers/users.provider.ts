import { Provider } from '@nestjs/common';
import { USER_READ_PORT } from '../application/ports/user-read.port';
import { UserReadRepository } from '../infra/repositories/user-read.repository';
import { USER_WRITE_PORT } from '../application/ports/user-write.port';
import { UserWriteRepository } from '../infra/repositories/user-write.repository';

export const usersProviders: Array<Provider> = [
  {
    provide: USER_READ_PORT,
    useClass: UserReadRepository,
  },
  {
    provide: USER_WRITE_PORT,
    useClass: UserWriteRepository,
  },
];
