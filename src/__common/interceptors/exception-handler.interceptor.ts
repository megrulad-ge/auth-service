import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from '../setup/logger';
import { RequestService } from '../setup/request';
import { LoggerUtils } from '../setup/logger';
import { QueryFailedError } from 'typeorm';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestService = new RequestService(request);
    const logger = new LoggerService(requestService);

    return next.handle().pipe(
      catchError((error) => {
        logger.error(
          LoggerUtils.stringify({
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            ...(error.isAxiosError && {
              response: {
                data: error.response?.data,
                message: error.response?.message,
              },
            }),
          }),
          'ExceptionInterceptor',
        );

        switch (true) {
          case error instanceof HttpException:
            throw error;
          // TypeORM exception
          case error instanceof QueryFailedError: {
            const typeORMError = error as QueryFailedError & { code: string; detail: string };
            // Duplicated key
            if (typeORMError.code === PG_UNIQUE_VIOLATION) throw new BadRequestException(typeORMError.detail);
            throw new InternalServerErrorException();
          }
          case error.name === 'EntityNotFoundError':
            throw new NotFoundException(error.message);
          case error.isAxiosError:
            const errorMessage = error.response?.data || error.message;
            throw new UnprocessableEntityException(errorMessage);
          default:
            throw new InternalServerErrorException();
        }
      }),
    );
  }
}
