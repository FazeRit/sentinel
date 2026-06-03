import { Inject, Injectable } from '@nestjs/common';
import { PaginationResult } from 'src/shared/presentation/dto/response/pagination-result.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../infra/repositories/user-read.repository';
import { USER_READ_PORT } from '../ports/user-read.port';

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(USER_READ_PORT)
    private readonly userReadRepo: UserReadRepository,
  ) {}

  async execute(
    cursor?: string,
    limit?: number,
  ): Promise<PaginationResult<UserEntity>> {
    const { items, meta } = await this.userReadRepo.findUsers(limit, cursor);

    return {
      items,
      meta,
    };
  }
}
