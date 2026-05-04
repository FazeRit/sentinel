import { Inject, Injectable } from '@nestjs/common';
import { IAuthResult } from '../../domain/types/auth.types';
import { JwtAdapterService } from '../../infra/services/jwt/jwt-adapter.service';
import { LoginUserDto } from '../../presentation/dto/request/login-user.dto';
import { TOKEN_PROVIDER_PORT } from '../ports/token-provider.port';
import { ValidateUserUseCase } from './validate-user.usecase';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly validateUser: ValidateUserUseCase,
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: JwtAdapterService,
  ) {}

  async execute(dto: LoginUserDto): Promise<IAuthResult> {
    const user = await this.validateUser.execute(dto.email, dto.password);

    const tokens = await this.tokenProvider.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      tokens,
    };
  }
}
