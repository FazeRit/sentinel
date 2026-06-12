import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/database/prisma.service';
import { SessionWritePort } from '../../application/ports/session-write.port';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionWriteRepository implements SessionWritePort {
  constructor(private readonly prisma: PrismaService) {}

  async saveSession(sessionEntity: SessionEntity): Promise<SessionEntity> {
    const model = SessionMapper.toModel(sessionEntity);

    const session = await this.prisma.session.upsert({
      where: {
        id: model.id,
      },
      create: model,
      update: model,
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
