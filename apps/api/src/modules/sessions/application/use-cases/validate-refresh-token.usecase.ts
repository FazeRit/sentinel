import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
    TOKEN_PROVIDER_PORT,
    TokenProviderPort,
} from 'src/modules/auth/application/ports/token-provider.port';
import { IJwtPayload } from 'src/modules/auth/domain/types/auth.types';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SESSION_READ_PORT, SessionReadPort } from '../ports/session-read.port';
import {
    SESSION_WRITE_PORT,
    SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class ValidateRefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
    @Inject(SESSION_READ_PORT)
    private readonly sessionReadPort: SessionReadPort,
  ) {}

  async execute(refreshToken: string): Promise<SessionEntity> {
    const payload =
      await this.tokenProvider.verifyToken<IJwtPayload>(refreshToken);
    if (!payload || !payload.sessionId) {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.sessionReadPort.findSessionById(
      payload.sessionId,
    );

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.refreshToken !== refreshToken || session.isRevoked()) {
      await this.sessionWritePort.revokeSessionsByUserId(session.userId);
      throw new UnauthorizedException('Security breach: Token reuse detected');
    }

    if (session.isExpired()) {
      throw new UnauthorizedException('Session expired');
    }

    return session;
  }
}
