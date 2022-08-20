import { Module } from '@nestjs/common';
import { SetupModule } from './__common/setup/setup.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [SetupModule, HealthModule, AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
