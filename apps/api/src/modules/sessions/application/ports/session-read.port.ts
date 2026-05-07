import { SessionEntity } from '../../domain/entities/session.entity';

export const SESSION_READ_PORT = Symbol('session-read-port');

export abstract class SessionReadPort {
  abstract findSessionById(id: string): Promise<SessionEntity | null>;
  abstract findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null>;
}
