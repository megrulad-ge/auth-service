import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClaims } from '../../users/user.type';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserClaims => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserClaims;
});
