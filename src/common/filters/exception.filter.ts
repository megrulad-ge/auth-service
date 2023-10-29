import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CorsException } from '../exceptions/cors.exception';
import { RequestService } from '../setup/request';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (exception instanceof CorsException) {
      Logger.warn(exception.message, 'Exception.filter(CORS)');
      return httpAdapter.reply(response, void 0, HttpStatus.NO_CONTENT);
    }

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      responseBody.message = exception.message;
    }

    if (!RequestService.hasRequestId(request)) {
      RequestService.injectRequestId(request);
    }

    httpAdapter.reply(response, responseBody, responseBody.statusCode);
  }
}
