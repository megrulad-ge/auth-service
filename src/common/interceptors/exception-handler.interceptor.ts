import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { Env } from '/common/env';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const logger = request.logger as Logger;

    return next.handle().pipe(
      catchError((error) => {
        logger.error(this.formatError(error) + '\n' + error.stack);

        throw error;
      }),
    );
  }

  private formatError(error: any) {
    if (Env.isProd) return JSON.stringify(error);

    return JSON.stringify(error, null, 2);
  }
}
