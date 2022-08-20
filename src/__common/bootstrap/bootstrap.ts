import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { LoggerService } from '../setup/logger';
import { ConfigService } from '@nestjs/config';
import { subscribeNodeSignals } from './signals';
import { configureOrigin } from './configure-origin';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { RequestInterceptor } from '../interceptors/request.interceptor';
import { ExceptionInterceptor } from '../interceptors/exception-handler.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger-config';
import { saveSwaggerDocument } from './swagger-save';
import { bgCyan, bold } from 'chalk';
import { Env } from '../env';

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  const config = app.get(ConfigService);
  subscribeNodeSignals(logger);
  app.enableCors({
    origin: configureOrigin,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type',
    exposedHeaders: 'Authorization',
    credentials: true,
  });
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new ExceptionInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  saveSwaggerDocument(document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const appPort = parseInt(config.get('PORT'), 10);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(appPort, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const devText = bold(`
        Application started at: ${url}
        Swagger docs: ${url}/docs
        Mode: ${bgCyan(Env.NodeEnv)}
        Pid: ${process.pid}
    `);
    if (Env.isDev) return console.log(devText);

    logger.log(`Application started at: ${url}`, 'Bootstrap');
  });
};
