import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { privateKey } from '/common/setup/keys/asymmetric.keys';
import jsonwebtoken from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.header('Authorization');
    if (!authorization) throw new UnauthorizedException('Authorization header is missing');

    const token = authorization.replace('Bearer ', '');

    try {
      jsonwebtoken.verify(token, privateKey, { algorithms: ['RS256'] });
    } catch (exception: unknown) {
      const message = exception instanceof Error ? exception.message : 'Invalid token';
      throw new UnauthorizedException(message);
    }

    return true;
  }
}
