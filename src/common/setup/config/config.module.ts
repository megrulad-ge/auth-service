import validationSchema, { validationOptions } from '../../validations/env-validation.schema';
import { ConfigModule as NestConfigModule } from '@nestjs/config/dist/config.module';
import { Module } from '@nestjs/common';
import database from './database.config';
import service from './service.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [database, service],
      validationOptions,
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
  ],
})
export class ConfigModule {}
