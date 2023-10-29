import { Module } from '@nestjs/common';
import { RequestModule } from './request/request.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [ConfigModule, RequestModule, DatabaseModule, SeederModule],
})
export class SetupModule {}
