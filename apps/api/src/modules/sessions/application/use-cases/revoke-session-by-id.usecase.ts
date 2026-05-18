import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { SESSION_READ_PORT, SessionReadPort } from '../ports/session-read.port';
import {
  SESSION_WRITE_PORT,
  SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class RevokeSessionByIdUseCase {
  constructor(
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
    @Inject(SESSION_READ_PORT)
    private readonly sessionReadPort: SessionReadPort,
  ) {}

  async execute(id: string): Promise<void> {
    const session = await this.sessionReadPort.findSessionById(id);

    if (!session || session.isRevoked()) {
      throw new NotFoundError(
        `Session with ID "${session?.id}" not found or already revoked`,
      );
    }

    session.revoke();

    await this.sessionWritePort.saveSession(session);
  }
}
