import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from '../sessions/session.module';
import { UsersModule } from '../users/users.module';
import { LoginUserUseCase } from './application/use-cases/login-user.usercase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { ValidateUserUseCase } from './application/use-cases/validate-user.usecase';
import { JwtAccessStrategy } from './infra/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './infra/strategies/jwt-refresh.strategy';
import { LocalAuthStrategy } from './infra/strategies/local-auth.strategy';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
        signOptions: {
          algorithm: 'RS256',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalAuthStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,

    LoginUserUseCase,
    RefreshTokenUseCase,
    RegisterUserUseCase,
    ValidateUserUseCase,
  ],
  exports: [],
})
export class AuthModule {}
