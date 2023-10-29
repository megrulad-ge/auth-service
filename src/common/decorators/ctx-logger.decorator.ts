import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const CtxLogger = createParamDecorator((data: unknown, ctx: ExecutionContext): Logger => {
  return ctx.switchToHttp().getRequest().logger as Logger;
});
