import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload, ITokenPair } from '../../domain/types/auth.types';
import {
  TOKEN_PROVIDER_PORT,
  TokenProviderPort,
} from '../ports/token-provider.port';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async execute(refreshToken: string): Promise<ITokenPair> {
    const payload =
      await this.tokenProvider.verifyToken<IJwtPayload>(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.tokenProvider.generateTokens(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
