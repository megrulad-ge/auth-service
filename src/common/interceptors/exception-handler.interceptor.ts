import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { Env } from '/common/env';
import { ExpressRequest } from '/common/types';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    return next.handle().pipe(
      catchError((error) => {
        request.logger.error(this.formatError(error) + '\n' + error.stack);

        throw error;
      }),
    );
  }

  private formatError(error: any) {
    if (Env.isProd) return JSON.stringify(error);

    return JSON.stringify(error, null, 2);
  }
}
