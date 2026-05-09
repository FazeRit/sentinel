import { Module } from '@nestjs/common';
import { CreateSessionUseCase } from './application/use-cases/create-session.usecase';
import { FindSessionByIdUseCase } from './application/use-cases/find-session-by-id.usecase';
import { FindSessionByRefreshTokenUseCase } from './application/use-cases/find-session-by-refresh-token..usecase';
import { RevokeSessionByIdUseCase } from './application/use-cases/revoke-session-by-id.usecase';
import { RevokeSessionsByUserIdUseCase } from './application/use-cases/revoke-sessions-by-user-id.usecase';
import { UpdateSessionUseCase } from './application/use-cases/update-session.usecase';
import { ValidateRefreshTokenUseCase } from './application/use-cases/validate-refresh-token.usecase';
import { sessionProviders } from './providers/session.provider';

@Module({
  providers: [
    ...sessionProviders,
    CreateSessionUseCase,
    FindSessionByIdUseCase,
    FindSessionByRefreshTokenUseCase,
    RevokeSessionByIdUseCase,
    RevokeSessionsByUserIdUseCase,
    UpdateSessionUseCase,
    ValidateRefreshTokenUseCase,
  ],
  exports: [
    CreateSessionUseCase,
    FindSessionByIdUseCase,
    FindSessionByRefreshTokenUseCase,
    RevokeSessionByIdUseCase,
    RevokeSessionsByUserIdUseCase,
    UpdateSessionUseCase,
    ValidateRefreshTokenUseCase,
  ],
})
export class SessionModule {}
