import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClaims } from '/src/users/user.type';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserClaims => {
  return ctx.switchToHttp().getRequest().user as UserClaims;
});
