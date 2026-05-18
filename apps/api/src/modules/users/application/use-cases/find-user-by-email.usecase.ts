import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../infra/repositories/user-read.repository';
import { USER_READ_PORT } from '../ports/user-read.port';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(USER_READ_PORT)
    private readonly userReadPort: UserReadRepository,
  ) {}

  async execute(email: string): Promise<UserEntity | null> {
    return this.userReadPort.findUserByEmail(email);
  }
}
