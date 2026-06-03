import { SetMetadata } from '@nestjs/common';
import { TUserRoles } from 'src/modules/users/domain/types/users.types';

export const ROLES_KEY = Symbol('roles');
export const Roles = (...roles: Array<TUserRoles>) =>
  SetMetadata(ROLES_KEY, roles);
