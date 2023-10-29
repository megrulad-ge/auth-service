import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { RequestService } from '../setup/request';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestService = new RequestService(request);
    const logger = new Logger(requestService.getRequestId());

    return next.handle().pipe(
      catchError((error) => {
        logger.error(
          JSON.stringify({
            message: error.message,
            stack: error.stack,
            name: error.name,
          }),
          'ExceptionInterceptor',
        );

        switch (true) {
          case error instanceof HttpException:
            throw error;
          // TypeORM exception
          case error instanceof QueryFailedError: {
            const typeORMError = error as QueryFailedError & { code: string; detail: string };
            throw new UnprocessableEntityException({
              message: typeORMError.message,
              code: typeORMError.code,
              detail: typeORMError.detail,
            });
          }
          default:
            throw new InternalServerErrorException();
        }
      }),
    );
  }
}
