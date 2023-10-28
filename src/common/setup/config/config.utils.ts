import { Env } from '../../env';

export const resolveEntityPath = () => {
  // Env for unit tests
  if (Env.isTest) return 'src/**/*.entity.ts';

  // Env is NodeEnv.PRODUCTION but for E2E tests
  if (Env.isE2E) return 'src/**/*.entity.ts';

  // Either NodeEnv.PRODUCTION or NodeEnv.DEVELOPMENT
  return 'dist/src/**/*.entity.js';
};
