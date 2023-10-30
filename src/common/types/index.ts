import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { UserClaims } from '/src/users/user.type';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  E2E = 'end2end',
  DEBUG = 'debug',
}

export type ExpressRequest = Request & {
  logger: Logger;
  user: UserClaims | null;
};
