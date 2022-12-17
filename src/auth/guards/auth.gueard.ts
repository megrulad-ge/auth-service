import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { privateKey } from '../../__common/setup/keys/asymmetric.keys';
import jsonwebtoken from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException('Authorization header is missing');

    const token = authorization.replace('Bearer ', '');

    try {
      jsonwebtoken.verify(token, privateKey, { algorithms: ['RS256'] });
    } catch ({ message = 'Invalid token' }) {
      throw new UnauthorizedException(message);
    }

    return true;
  }
}
