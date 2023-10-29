import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CorsException } from '../exceptions/cors.exception';
import { EntityException } from '/common/exceptions/entity.exception';
import { ErrorResponse } from '/common/exceptions/error.response';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof CorsException) {
      Logger.warn(exception.message, 'Exception.filter(CORS)');
      return httpAdapter.reply(response, void 0, HttpStatus.NO_CONTENT);
    }

    const responseBody = new ErrorResponse({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });

    if (exception instanceof HttpException) {
      const error = exception.getResponse() as any; // Returns class-validator error
      const errorDetails = error.message || null;
      const errorMessage = error.error || exception.message;
      responseBody.statusCode = exception.getStatus();
      responseBody.message = errorMessage;
      responseBody.details = errorDetails;
    }

    if (exception instanceof EntityException) {
      responseBody.message = exception.message;
      responseBody.statusCode = exception.code;
      responseBody.details = exception.details;
    }

    httpAdapter.reply(response, responseBody, responseBody.statusCode);
  }
}
