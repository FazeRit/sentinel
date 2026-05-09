import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedUser } from 'src/modules/auth/domain/types/auth.types';

export const CurrentUser = createParamDecorator(
  (data: keyof IAuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as IAuthenticatedUser;

    if (!user) return null;

    if (data) {
      return user[data];
    }

    return user.sessionId;
  },
);
