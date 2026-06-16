import { randomUUID } from 'crypto';
import { TCreateChatProps, TRestoreChatProps } from '../types/chat.types';

export class ChatEntity {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: TRestoreChatProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: TCreateChatProps): ChatEntity {
    const now = new Date();
    return new ChatEntity({
      ...props,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: TRestoreChatProps): ChatEntity {
    return new ChatEntity(props);
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
