import { Session as PrismaSession } from '@prisma/client';
import { SessionEntity } from '../../domain/entities/session.entity';

export class SessionMapper {
  static toEntity(model: PrismaSession): SessionEntity {
    return SessionEntity.restore({
      id: model.id,
      userId: model.userId,
      refreshToken: model.refreshToken,
      ip: model.ip ?? undefined,
      userAgent: model.userAgent ?? undefined,
      expiresAt: model.expiresAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      revokedAt: model.revokedAt ?? undefined,
    });
  }

  static toModel(entity: SessionEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      refreshToken: entity.refreshToken,
      ip: entity.ip,
      userAgent: entity.userAgent,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      revokedAt: entity.revokedAt,
    };
  }
}
