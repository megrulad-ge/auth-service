import { Module } from '@nestjs/common';
import { SetupModule } from './__common/setup/setup.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { RolesModule } from './roles/roles.module';
import { HttpExceptionsFilter } from './__common/filters/exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [SetupModule, HealthModule, AuthModule, UsersModule, RolesModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
