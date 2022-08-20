import { Injectable, Logger } from '@nestjs/common';
import { CaptureContext, Severity, SeverityLevel } from '@sentry/types';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Env } from '../../env';

@Injectable()
export class SentryFactoryService {
  constructor(@InjectSentry() private readonly sentry: SentryService) {}

  public static get enabled(): boolean {
    return Env.isProd && process.env.SENTRY_FAKE_REPORT !== 'enabled';
  }

  captureMessage(message: string, captureContext: CaptureContext | SeverityLevel = 'info') {
    if (!SentryFactoryService.enabled) return Logger.log('This would be reported', 'Sentry');

    this.sentry.instance().captureMessage(message, <Severity>captureContext);
  }
}
