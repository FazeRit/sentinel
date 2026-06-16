import { randomUUID } from 'crypto';
import { ChatRole } from '@prisma/client';
import {
  TCreateChatMessageProps,
  TRestoreChatMessageProps,
} from '../types/chat-message.types';

export class ChatMessageEntity {
  private readonly _id: string;
  private readonly _chatId: string;
  private readonly _role: ChatRole;
  private readonly _content: string;
  private readonly _createdAt: Date;

  private constructor(props: TRestoreChatMessageProps) {
    this._id = props.id;
    this._chatId = props.chatId;
    this._role = props.role;
    this._content = props.content;
    this._createdAt = props.createdAt;
  }

  public static create(props: TCreateChatMessageProps): ChatMessageEntity {
    const now = new Date();
    return new ChatMessageEntity({
      ...props,
      id: randomUUID(),
      createdAt: now,
    });
  }

  public static restore(props: TRestoreChatMessageProps): ChatMessageEntity {
    return new ChatMessageEntity(props);
  }

  public get id(): string {
    return this._id;
  }

  public get chatId(): string {
    return this._chatId;
  }

  public get role(): ChatRole {
    return this._role;
  }

  public get content(): string {
    return this._content;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
}
