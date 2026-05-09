import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateSessionUseCase } from 'src/modules/sessions/application/use-cases/create-session.usecase';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.usecase'; // 👈 Додаємо
import { FindUserByEmailUseCase } from 'src/modules/users/application/use-cases/find-user-by-email.usecase';
import { IAuthResult } from '../../domain/types/auth.types';
import {
  TOKEN_PROVIDER_PORT,
  TokenProviderPort,
} from '../ports/token-provider.port';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    ip?: string,
    userAgent?: string,
  ): Promise<IAuthResult> {
    const existingUser = await this.findUserByEmailUseCase.execute(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.createUserUseCase.execute(name, email, password);

    const sessionId = crypto.randomUUID();

    const tokens = await this.tokenProvider.generateTokens({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      sessionId,
    });

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS);

    await this.createSessionUseCase.execute(
      newUser.id,
      sessionId,
      tokens.refreshToken,
      expiresAt,
      ip,
      userAgent,
    );

    return {
      user: newUser,
      tokens,
    };
  }
}
