import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentryModule as OriginalSentryModule } from '@ntegral/nestjs-sentry';
import { SentryFactoryService } from './sentry.service';

@Module({})
export class SentryModule {
  static forRootAsync(): DynamicModule {
    if (!SentryFactoryService.enabled)
      return {
        module: SentryModule,
        providers: [],
        exports: [],
      };

    return {
      module: SentryModule,
      imports: [
        OriginalSentryModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get('sentry'),
          inject: [ConfigService],
        }),
      ],
      providers: [SentryFactoryService],
      exports: [SentryFactoryService],
    };
  }
}
