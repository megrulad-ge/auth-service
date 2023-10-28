import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '/src/app.module';
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
import { UserInterceptor } from '../interceptors/user.interceptor';

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  const configService = app.get(ConfigService);
  subscribeNodeSignals(loggerService);
  app.enableCors({
    origin: configureOrigin,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type',
    exposedHeaders: 'Authorization',
    credentials: true,
  });
  app.useLogger(loggerService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new UserInterceptor(),
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
  const appPort = parseInt(configService.get('PORT'), 10);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(appPort, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const devText = bold(`
        Authentication service started at: ${url}
        Swagger docs: ${url}/docs
        Mode: ${bgCyan(Env.NodeEnv)}
        Pid: ${process.pid}
    `);
    if (Env.isDev) return console.log(devText);

    loggerService.log(`Application started at: ${url}`, 'Bootstrap');
  });
};
