import { SessionEntity } from '../../domain/entities/session.entity';

export const SESSION_WRITE_PORT = Symbol('session-write-port');

export abstract class SessionWritePort {
  abstract saveSession(sessionEntity: SessionEntity): Promise<SessionEntity>;
  abstract updateSession(sessionEntity: SessionEntity): Promise<SessionEntity>;
  abstract revokeSessionById(id: string): Promise<void>;
  abstract revokeSessionsByUserId(userId: string): Promise<void>;
}
