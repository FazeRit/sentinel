import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidateRefreshTokenUseCase } from 'src/modules/sessions/application/use-cases/validate-refresh-token.usecase';
import { FindUserByIdUseCase } from 'src/modules/users/application/use-cases/find-user-by-id.usecase';
import { IAuthenticatedUser, IJwtPayload } from '../../domain/types/auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly validateRefreshTokenUseCase: ValidateRefreshTokenUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refreshToken'],
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_PRIVATE_SECRET'),
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: IJwtPayload,
  ): Promise<IAuthenticatedUser> {
    const refreshToken = req?.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const session =
      await this.validateRefreshTokenUseCase.execute(refreshToken);

    const user = await this.findUserByIdUseCase.execute(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return Object.assign(user, {
      sessionId: session.id,
    });
  }
}
