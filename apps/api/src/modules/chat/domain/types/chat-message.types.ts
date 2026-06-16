import { ChatRole } from '@prisma/client';

export interface IChatMessageProps {
  id: string;
  chatId: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

export type TCreateChatMessageProps = Omit<
  IChatMessageProps,
  'id' | 'createdAt'
>;

export type TRestoreChatMessageProps = IChatMessageProps;
