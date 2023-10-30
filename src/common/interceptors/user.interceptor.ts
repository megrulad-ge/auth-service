import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ExpressRequest } from '/common/types';
import jsonwebtoken from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { UserClaims } from '/src/users/user.type';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const authorization = request.header('authorization');

    request.user = null;

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      request.user = jsonwebtoken.decode(token, { json: true }) as UserClaims;
    }

    return next.handle();
  }
}
