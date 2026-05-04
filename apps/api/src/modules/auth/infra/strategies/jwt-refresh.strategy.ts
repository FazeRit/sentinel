import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FindUserByIdUseCase } from 'src/modules/users/application/use-cases/find-user-by-id.usecase';
import { IJwtPayload } from '../../domain/types/auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_PRIVATE_SECRET'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: IJwtPayload) {
    const { sub, email } = payload;
    if (!sub || !email) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.findUserByIdUseCase.execute(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
