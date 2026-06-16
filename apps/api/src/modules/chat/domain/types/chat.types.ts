export interface IChatProps {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TCreateChatProps = Omit<
  IChatProps,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TRestoreChatProps = IChatProps;
