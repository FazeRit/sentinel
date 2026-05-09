export interface ISessionProps {
  id: string;
  userId: string;
  refreshToken: string;
  ip?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  revokedAt?: Date | null;
}

export type TCreateSessionProps = Omit<
  ISessionProps,
  'createdAt' | 'updatedAt' | 'revokedAt'
>;

export type TRestoreSessionProps = ISessionProps;
