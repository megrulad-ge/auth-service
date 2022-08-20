import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config/dist/config.module';
import database from './database.config';
import clients from './clients.config';
import service from './service.config';
import sentry from './sentry.config';
import validationSchema, { validationOptions } from '../../validations/env-validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [database, clients, service, sentry],
      validationOptions,
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
