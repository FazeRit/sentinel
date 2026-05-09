import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

export interface IJwtPayload {
  sub: string;
  sessionId: string;
  email: string;
  role?: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResult {
  tokens: ITokenPair;
  user: UserEntity;
}

export interface IAuthenticatedUser extends UserEntity {
  sessionId: string;
}
