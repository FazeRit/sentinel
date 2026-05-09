import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { FindSessionByIdUseCase } from 'src/modules/sessions/application/use-cases/find-session-by-id.usecase';
import { RevokeSessionsByUserIdUseCase } from 'src/modules/sessions/application/use-cases/revoke-sessions-by-user-id.usecase';
import { UpdateSessionUseCase } from 'src/modules/sessions/application/use-cases/update-session.usecase';
import { IJwtPayload, ITokenPair } from '../../domain/types/auth.types';
import {
  TOKEN_PROVIDER_PORT,
  TokenProviderPort,
} from '../ports/token-provider.port';

// TODO: add check for ip and different stuff like that, improve somehow it
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
    private readonly updateSessionUseCase: UpdateSessionUseCase,
    private readonly findSessionByIdUseCase: FindSessionByIdUseCase,
    private readonly revokeSessionsByUserIdUseCase: RevokeSessionsByUserIdUseCase,
  ) {}

  async execute(refreshToken: string): Promise<ITokenPair> {
    const payload =
      await this.tokenProvider.verifyToken<IJwtPayload>(refreshToken);
    if (!payload || !payload.sessionId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.findSessionByIdUseCase.execute(
      payload.sessionId,
    );

    if (!session || !session.isActive()) {
      throw new UnauthorizedException('Session is no longer active');
    }

    if (session.isRevoked()) {
      await this.revokeSessionsByUserIdUseCase.execute(session.userId);
      throw new UnauthorizedException('Security breach: Token reuse detected');
    }

    if (session.isExpired()) {
      throw new UnauthorizedException('Session expired');
    }

    const tokens = await this.tokenProvider.generateTokens({
      sub: payload.sub,
      email: payload.email,
      sessionId: session.id,
    });

    const newExpiryDate = this.getNewExpiryDate();

    session.refresh(tokens.refreshToken, newExpiryDate);

    await this.updateSessionUseCase.execute(session);

    return tokens;
  }

  private getNewExpiryDate(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
