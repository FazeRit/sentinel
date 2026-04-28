import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../infra/repositories/user-read.repository';
import { USER_READ_PORT } from '../ports/user-read.port';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(USER_READ_PORT)
    private readonly userReadPort: UserReadRepository,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userReadPort.findUserByEmail(id);

    if (!user) {
      throw new NotFoundException(`User with that id don't exists`);
    }

    return user;
  }
}
