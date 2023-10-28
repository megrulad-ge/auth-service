import { NodeEnv } from '../../types';
import { resolveEntityPath } from './config.utils';

describe('resolveEntityPath', () => {
  it('should resolve correct path for Test', () => {
    process.env.NODE_ENV = NodeEnv.TEST;
    expect(resolveEntityPath()).toBe('src/**/*.entity.ts');
    process.env.NODE_ENV = NodeEnv.TEST;
  });

  it('should resolve correct path for Dev', () => {
    process.env.NODE_ENV = NodeEnv.DEVELOPMENT;
    expect(resolveEntityPath()).toBe('dist/src/**/*.entity.js');
    process.env.NODE_ENV = NodeEnv.TEST;
  });

  it('should resolve correct path for Prod', () => {
    process.env.NODE_ENV = NodeEnv.PRODUCTION;
    expect(resolveEntityPath()).toBe('dist/src/**/*.entity.js');
    process.env.NODE_ENV = NodeEnv.TEST;
  });

  it('should resolve correct path for E2E', () => {
    process.env.NODE_ENV = NodeEnv.PRODUCTION;
    process.env.E2E = NodeEnv.E2E;
    expect(resolveEntityPath()).toBe('src/**/*.entity.ts');
    process.env.NODE_ENV = NodeEnv.TEST;
    process.env.E2E = '';
  });
});
