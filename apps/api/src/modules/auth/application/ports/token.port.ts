import { IJwtPayload, ITokenPair } from '../../domain/types/auth.types';

export const TOKEN_PROVIDER_PORT = Symbol('TOKEN_PROVIDER_PORT');

export interface TokenProviderPort {
  generateTokens(payload: IJwtPayload): Promise<ITokenPair>;
  verifyToken(token: string): Promise<IJwtPayload | null>;
}
