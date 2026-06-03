import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RevokeSessionByIdUseCase } from 'src/modules/sessions/application/use-cases/revoke-session-by-id.usecase';
import { RevokeSessionsByUserIdUseCase } from 'src/modules/sessions/application/use-cases/revoke-sessions-by-user-id.usecase';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { UserResponseDto } from 'src/modules/users/presentation/dto/response/user-response.dto';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { Public } from 'src/shared/presentation/decorators/public.decorator';
import { CustomThrottle } from 'src/shared/presentation/decorators/custom-throttle.decorator';
import { ApiResponseDto } from 'src/shared/presentation/dto/response/api-response.dto';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usercase';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.usecase';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginUserDto } from '../dto/request/login-user.dto';
import { RegisterUserDto } from '../dto/request/register-user.dto';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';

// TODO: add user/me endpoint
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeSessionUseCase: RevokeSessionByIdUseCase,
    private readonly revokeAllUseCase: RevokeSessionsByUserIdUseCase,
  ) {}

  @Public()
  @CustomThrottle({ limit: 5, ttl: 60 })
  @Post('register')
  async register(
    @Body() dto: RegisterUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const { name, email, password } = dto;

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const { tokens, user } = await this.registerUseCase.execute(
      name,
      email,
      password,
      ip,
      userAgent,
    );

    this.setAccessTokenCookie(res, tokens.accessToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    const userDto = UserResponseDto.fromEntity(user);

    const response = new ApiResponseDto<UserResponseDto>({
      data: userDto,
      status: HttpStatus.CREATED,
      message: 'User registered successfully',
      timestamp: new Date(),
      path: req.url,
    });

    return response;
  }

  @CustomThrottle({ limit: 5, ttl: 60 })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() dto: LoginUserDto,
  ) {
    const { email, password } = dto;

    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const tokens = await this.loginUseCase.execute(
      email,
      password,
      ip,
      userAgent,
    );

    this.setAccessTokenCookie(res, tokens.accessToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    const response = new ApiResponseDto<UserResponseDto>({
      data: UserResponseDto.fromEntity(user),
      status: HttpStatus.OK,
      message: 'Login successful',
      timestamp: new Date(),
      path: req.url,
    });

    return response;
  }

  @CustomThrottle({ limit: 10, ttl: 60 })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Res({
      passthrough: true,
    })
    res: Response,
    @Req() req: Request,
  ): Promise<ApiResponseDto<null>> {
    const refreshToken = req.cookies['refreshToken'];

    const tokens = await this.refreshTokenUseCase.execute(refreshToken);

    this.setAccessTokenCookie(res, tokens.accessToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    const response = new ApiResponseDto({
      data: null,
      status: HttpStatus.OK,
      message: 'Token refreshed successfully',
      timestamp: new Date(),
      path: req.url,
    });

    return response;
  }
  // TODO: think about logout use case
  @Post('logout')
  @CustomThrottle({ limit: 10, ttl: 60 })
  @UseGuards(JwtAccessGuard)
  async logout(
    @CurrentUser('sessionId') sessionId: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<ApiResponseDto<null>> {
    await this.revokeSessionUseCase.execute(sessionId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    const response = new ApiResponseDto({
      data: null,
      status: HttpStatus.OK,
      message: 'Logout successful',
      timestamp: new Date(),
      path: req.url,
    });

    return response;
  }

  // TODO: think about logout all use case
  @Post('logout-all')
  @CustomThrottle({ limit: 10, ttl: 60 })
  @UseGuards(JwtAccessGuard)
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<ApiResponseDto<null>> {
    await this.revokeAllUseCase.execute(userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    const response = new ApiResponseDto({
      data: null,
      status: HttpStatus.OK,
      message: 'Logged out from all devices',
      timestamp: new Date(),
      path: req.url,
    });

    return response;
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private setAccessTokenCookie(res: Response, token: string) {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
  }
}
