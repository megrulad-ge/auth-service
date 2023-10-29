import { Module } from '@nestjs/common';
import { SetupModule } from '/common/setup/setup.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { HttpExceptionsFilter } from '/common/filters/exception.filter';
import { SessionModule } from './session/session.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [SetupModule, HealthModule, AuthModule, UsersModule, RolesModule, SessionModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
