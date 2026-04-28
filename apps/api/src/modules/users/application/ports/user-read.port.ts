import { PaginationResult } from 'src/shared/dto/response/pagination-result.dto';
import { UserEntity } from '../../domain/entities/user.entity';

export const USER_READ_PORT = Symbol('user-read-port');

export abstract class UserReadPort {
  abstract findUserById(id: string): Promise<UserEntity | null>;
  abstract findUsers(
    limit?: number,
    cursor?: string,
  ): Promise<PaginationResult<UserEntity>>;
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
}
