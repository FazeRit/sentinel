import { UserEntity } from '../../domain/entities/user.entity';

export const USER_WRITE_PORT = Symbol('user-write-port');

export abstract class UserWritePort {
  abstract saveUser(userEntity: UserEntity): Promise<UserEntity>;
  abstract updateUser(userEntity: UserEntity): Promise<UserEntity>;
  abstract deleteUserById(id: string): Promise<void>;
}
