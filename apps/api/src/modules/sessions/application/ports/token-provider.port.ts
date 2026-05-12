import { IJwtPayload, ITokenPair } from '../../../auth/domain/types/auth.types';

export const TOKEN_PROVIDER_PORT = Symbol('TOKEN_PROVIDER_PORT');

export interface TokenProviderPort {
  generateTokens(payload: IJwtPayload): Promise<ITokenPair>;
  verifyToken<T extends object = IJwtPayload>(token: string): Promise<T | null>;
}
