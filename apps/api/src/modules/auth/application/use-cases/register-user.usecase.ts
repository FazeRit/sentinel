import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.usecase'; // 👈 Додаємо
import { FindUserByEmailUseCase } from 'src/modules/users/application/use-cases/find-user-by-email.usecase';
import { IAuthResult } from '../../domain/types/auth.types';
import { RegisterUserDto } from '../../presentation/dto/request/register-user.dto';
import {
  TOKEN_PROVIDER_PORT,
  TokenProviderPort,
} from '../ports/token-provider.port'; // 👈 Використовуй порт, а не сервіс напряму

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async execute(dto: RegisterUserDto): Promise<IAuthResult> {
    const { name, email, password } = dto;

    const existingUser = await this.findUserByEmailUseCase.execute(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.createUserUseCase.execute(name, email, password);

    const tokens = await this.tokenProvider.generateTokens({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: newUser,
      tokens,
    };
  }
}
