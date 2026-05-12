import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenProviderPort } from 'src/modules/sessions/application/ports/token-provider.port';
import {
  IJwtPayload,
  ITokenPair,
} from 'src/modules/auth/domain/types/auth.types';

@Injectable()
export class JwtAdapterService implements TokenProviderPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generateTokens(payload: IJwtPayload): Promise<ITokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.getOrThrow<string>('JWT_PRIVATE_KEY'),
      algorithm: 'RS256',
    });
  }

  private async generateRefreshToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.getOrThrow<string>('JWT_REFRESH_PRIVATE_KEY'),
      algorithm: 'RS256',
    });
  }

  async verifyToken<T extends object = IJwtPayload>(
    token: string,
  ): Promise<T | null> {
    try {
      const payload = await this.jwtService.verifyAsync<T>(token, {
        secret: this.config.getOrThrow<string>('JWT_PUBLIC_KEY'),
        algorithms: ['RS256'],
      });

      return payload;
    } catch {
      return null;
    }
  }
}
