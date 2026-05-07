import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SESSION_READ_PORT, SessionReadPort } from '../ports/session-read.port';

@Injectable()
export class FindSessionByRefreshTokenUseCase {
  constructor(
    @Inject(SESSION_READ_PORT)
    private readonly sessionReadPort: SessionReadPort,
  ) {}

  async execute(refreshToken: string): Promise<SessionEntity> {
    const session =
      await this.sessionReadPort.findSessionByRefreshToken(refreshToken);

    if (!session) {
      throw new NotFoundException(`Session not found`);
    }

    return session;
  }
}
