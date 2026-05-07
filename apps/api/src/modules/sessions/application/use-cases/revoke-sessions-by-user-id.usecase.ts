import { Inject, Injectable } from '@nestjs/common';
import {
    SESSION_WRITE_PORT,
    SessionWritePort,
} from '../ports/session-write.port';

@Injectable()
export class RevokeSessionsByUserIdUseCase {
  constructor(
    @Inject(SESSION_WRITE_PORT)
    private readonly sessionWritePort: SessionWritePort,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.sessionWritePort.revokeSessionsByUserId(userId);
  }
}
