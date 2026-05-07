import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { SessionWritePort } from '../../application/ports/session-write.port';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionWriteRepository implements SessionWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async saveSession(sessionEntity: SessionEntity): Promise<SessionEntity> {
    const model = SessionMapper.toModel(sessionEntity);

    const session = await this.prisma.session.create({
      data: model,
    });

    return SessionMapper.toEntity(session);
  }

  async updateSession(sessionEntity: SessionEntity): Promise<SessionEntity> {
    const model = SessionMapper.toModel(sessionEntity);

    const session = await this.prisma.session.update({
      where: {
        id: model.id,
      },
      data: model,
    });

    return SessionMapper.toEntity(session);
  }

  async deleteSessionById(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteSessionsByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async revokeSessionById(id: string): Promise<void> {
    await this.prisma.session.update({
      where: {
        id: id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeSessionsByUserId(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId: userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
