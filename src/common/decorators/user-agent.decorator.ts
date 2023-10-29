import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  return ctx.switchToHttp().getRequest().get('user-agent');
});
