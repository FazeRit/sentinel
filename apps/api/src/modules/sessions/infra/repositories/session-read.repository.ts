import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { SessionReadPort } from '../../application/ports/session-read.port';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionReadRepository implements SessionReadPort {
  constructor(private readonly prisma: PrismaService) {}

  async findSessionById(id: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        id,
      },
    });

    if (!session) return null;

    return SessionMapper.toEntity(session);
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        refreshToken,
      },
    });

    if (!session) return null;

    return SessionMapper.toEntity(session);
  }
}
