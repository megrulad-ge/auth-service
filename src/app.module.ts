import { Module } from '@nestjs/common';
import { SetupModule } from './__common/setup/setup.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [SetupModule, HealthModule],
})
export class AppModule {}
