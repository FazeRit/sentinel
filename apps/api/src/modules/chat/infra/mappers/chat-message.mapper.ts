import { ChatMessage as PrismaChatMessage, ChatRole } from '@prisma/client';
import { ChatMessageEntity } from '../../domain/entities/chat-message.entity';

export class ChatMessageMapper {
  static toEntity(model: PrismaChatMessage): ChatMessageEntity {
    return ChatMessageEntity.restore({
      id: model.id,
      chatId: model.chatId,
      role: model.role as ChatRole,
      content: model.content,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: ChatMessageEntity): PrismaChatMessage {
    return {
      id: entity.id,
      chatId: entity.chatId,
      role: entity.role,
      content: entity.content,
      createdAt: entity.createdAt,
    };
  }
}
