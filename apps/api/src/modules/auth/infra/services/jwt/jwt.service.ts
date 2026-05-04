import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenProviderPort } from 'src/modules/auth/application/ports/token.port';
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

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.getOrThrow('JWT_PUBLIC_SECRET'),
    });
  }

  private async generateRefreshToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
      },
      {
        secret: this.config.getOrThrow('JWT_PUBLIC_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async verifyToken(token: string): Promise<IJwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);

      return payload;
    } catch {
      return null;
    }
  }
}
