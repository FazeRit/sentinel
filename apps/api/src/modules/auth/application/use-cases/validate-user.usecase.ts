import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { FindUserByEmailUseCase } from 'src/modules/users/application/use-cases/find-user-by-email.usecase';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  async execute(email: string, password: string): Promise<UserEntity> {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
