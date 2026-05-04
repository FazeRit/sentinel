import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { DeleteUserByIdUseCase } from './application/use-cases/delete-user-by-id.usecase';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { FindUsersUseCase } from './application/use-cases/find-users.usecase';
import { usersProviders } from './providers/users.provider';

@Module({
  providers: [
    ...usersProviders,
    CreateUserUseCase,
    DeleteUserByIdUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    FindUsersUseCase,
  ],
})
export class UsersModule {}
