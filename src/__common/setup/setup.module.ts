import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { RequestModule } from './request/request.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './seeder/seeder.module';
import { SentryModule } from './sentry/sentry.module';

@Module({
  imports: [ConfigModule, LoggerModule, RequestModule, DatabaseModule, SeederModule, SentryModule],
})
export class SetupModule {}
