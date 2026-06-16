import { Chat as PrismaChat } from '@prisma/client';
import { ChatEntity } from '../../domain/entities/chat.entity';

export class ChatMapper {
  static toEntity(model: PrismaChat): ChatEntity {
    return ChatEntity.restore({
      id: model.id,
      userId: model.userId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: ChatEntity): PrismaChat {
    return {
      id: entity.id,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
