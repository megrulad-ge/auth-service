import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolveEntityPath } from './config.utils';
import { config } from 'dotenv';
import { Env } from '../../env'; // Leave relative path here
// For some reason DB envs are not parsed when Nest registers them.
config({ path: `.env.${process.env.NODE_ENV}` });

export const driver = 'mysql';
const commonConfiguration: TypeOrmModuleOptions = {
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  entities: [resolveEntityPath()],
};

const development = {
  ...commonConfiguration,
  database: process.env.DB_DATABASE,
  type: driver,
  logging: 'all',
} as TypeOrmModuleOptions;

const production = {
  ...commonConfiguration,
  database: process.env.DB_DATABASE,
  type: driver,
  logging: ['error'],
} as TypeOrmModuleOptions;

const unitTest = {
  ...commonConfiguration,
  database: ':memory:',
  type: 'sqlite',
  synchronize: true, // Create tables from entities
  logging: false,
} as TypeOrmModuleOptions;

export const getConfig = () => {
  if (Env.isProd) return production;
  if (Env.isDev) return development;
  if (Env.isTest) return unitTest;

  throw new Error('Unknown environment');
};
