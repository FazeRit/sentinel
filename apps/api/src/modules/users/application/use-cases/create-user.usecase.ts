import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserEntity } from '../../domain/entities/user.entity';
import { USER_ROLES } from '../../domain/types/users.types';
import { USER_WRITE_PORT, UserWritePort } from '../ports/user-write.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_WRITE_PORT)
    private readonly userWritePort: UserWritePort,
  ) {}

  async execute(
    name: string,
    email: string,
    passwordPlain: string,
  ): Promise<UserEntity> {
    const hashedPassword = await argon2.hash(passwordPlain);

    const userEntity = UserEntity.create({
      name,
      email,
      password: hashedPassword,
      role: USER_ROLES.USER,
    });

    await this.userWritePort.saveUser(userEntity);

    return userEntity;
  }
}
