import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import jsonwebtoken from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    request.user = null;
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      request.user = jsonwebtoken.decode(token);
    }

    return next.handle();
  }
}
