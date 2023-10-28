import { Module } from '@nestjs/common';
import { SetupModule } from '/common/setup/setup.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { RolesModule } from './roles/roles.module';
import { HttpExceptionsFilter } from '/common/filters/exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { SessionModule } from './session/session.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [SetupModule, HealthModule, AuthModule, UsersModule, RolesModule, SessionModule, ClientModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
