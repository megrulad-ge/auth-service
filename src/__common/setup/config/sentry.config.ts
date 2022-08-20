import { registerAs } from '@nestjs/config';
import { SentryModuleOptions } from '@ntegral/nestjs-sentry/lib/sentry.interfaces';

export default registerAs(
  'sentry',
  () =>
    ({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENV,
      tracesSampleRate: parseFloat(process.env.SENTRY_TSR),
      release: process.env.RELEASE_NAME,
      logLevels: ['error', 'warn'],
    } as SentryModuleOptions),
);
