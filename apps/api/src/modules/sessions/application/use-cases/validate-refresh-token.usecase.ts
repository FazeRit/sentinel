import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SESSION_READ_PORT, SessionReadPort } from '../ports/session-read.port';
import {
  SESSION_WRITE_PORT,
  SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class ValidateRefreshTokenUseCase {
  constructor(
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
    @Inject(SESSION_READ_PORT)
    private readonly sessionReadPort: SessionReadPort,
  ) {}

  async execute(refreshToken: string): Promise<SessionEntity> {
    const session =
      await this.sessionReadPort.findSessionByRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.isRevoked()) {
      await this.sessionWritePort.revokeSessionsByUserId(session.userId);
      throw new UnauthorizedException(
        'Security breach: Token reuse detected. All sessions revoked.',
      );
    }

    if (session.isExpired()) {
      throw new UnauthorizedException('Session expired');
    }

    return session;
  }
}
