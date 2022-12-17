import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Env } from '../env';
import { CorsException } from '../exceptions/cors.exception';
import { RequestService } from '../setup/request';
import { LoggerService, LoggerUtils } from '../setup/logger';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const started = Date.now();
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (exception instanceof CorsException) {
      Logger.log(exception.message, 'Exception.filter(CORS)');
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

    const requestService = new RequestService(request);
    const logger = new LoggerService(requestService);
    const reqId = requestService.getRequestId();

    const text = { started: 'Started', completed: 'Completed', payload: 'Payload' };
    const { ip, method, originalUrl } = request;
    const userAgent = (Env.isProd && request.get('user-agent')) || '';

    response.on('finish', () => {
      const { statusCode: code } = responseBody;
      const duration = Date.now() - started;
      text.completed = `${text.completed} in ${duration}ms`;

      logger.log(`${text.completed} ${method} ${code} ${originalUrl} - ${userAgent} ${ip}`, reqId);
    });

    logger.log(`${text.started} ${method} ${originalUrl} - ${userAgent} ${ip}`, reqId);
    logger.log(`${text.payload} ${LoggerUtils.stringify(request.body)}`, reqId);

    httpAdapter.reply(response, responseBody, responseBody.statusCode);
  }
}
