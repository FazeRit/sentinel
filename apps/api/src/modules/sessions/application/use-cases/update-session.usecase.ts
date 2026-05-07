import { Inject, Injectable } from '@nestjs/common';
import { SessionEntity } from '../../domain/entities/session.entity';
import {
  SESSION_WRITE_PORT,
  SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class UpdateSessionUseCase {
  constructor(
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
  ) {}

  async execute(session: SessionEntity): Promise<SessionEntity> {
    return await this.sessionWritePort.updateSession(session);
  }
}
