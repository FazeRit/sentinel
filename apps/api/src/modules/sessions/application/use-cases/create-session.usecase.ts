import { Inject, Injectable } from '@nestjs/common';
import { SessionEntity } from '../../domain/entities/session.entity';
import {
  SESSION_WRITE_PORT,
  SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
  ) {}

  async execution(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
    ip?: string,
    userAgent?: string,
  ): Promise<SessionEntity> {
    const sessionEntity = SessionEntity.create({
      userId: userId,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      ip: ip,
      userAgent: userAgent,
    });

    const savedSession = await this.sessionWritePort.saveSession(sessionEntity);

    return savedSession;
  }
}
