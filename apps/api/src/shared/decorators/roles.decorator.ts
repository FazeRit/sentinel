import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/modules/users/domain/types/users.types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<UserRoles>) =>
  SetMetadata(ROLES_KEY, roles);
