import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionUseCase } from 'src/modules/sessions/application/use-cases/create-session.usecase';
import { ITokenPair } from '../../domain/types/auth.types';
import { JwtAdapterService } from '../../infra/services/jwt/jwt-adapter.service';
import { TOKEN_PROVIDER_PORT } from '../ports/token-provider.port';
import { ValidateUserUseCase } from './validate-user.usecase';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly validateUser: ValidateUserUseCase,
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: JwtAdapterService,
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  async execute(
    email: string,
    password: string,
    ip?: string,
    userAgent?: string,
  ): Promise<ITokenPair> {
    const user = await this.validateUser.execute(email, password);

    const sessionId = crypto.randomUUID();

    const tokens = await this.tokenProvider.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    });

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS);

    await this.createSessionUseCase.execute(
      user.id,
      sessionId,
      tokens.refreshToken,
      expiresAt,
      ip,
      userAgent,
    );
    return tokens;
  }
}
