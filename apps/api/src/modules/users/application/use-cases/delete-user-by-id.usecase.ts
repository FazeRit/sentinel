import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserReadRepository } from '../../infra/repositories/user-read.repository';
import { UserWriteRepository } from '../../infra/repositories/user-write.repository';
import { USER_READ_PORT } from '../ports/user-read.port';
import { USER_WRITE_PORT } from '../ports/user-write.port';

@Injectable()
export class DeleteUserByIdUseCase {
  constructor(
    @Inject(USER_WRITE_PORT)
    private readonly userWriteRepo: UserWriteRepository,
    @Inject(USER_READ_PORT)
    private readonly userReadRepo: UserReadRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userReadRepo.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userWriteRepo.deleteUserById(id);
  }
}
