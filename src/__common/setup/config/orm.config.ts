import { Env } from '../../env';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolveEntityPath } from './config.utils';
import { config } from 'dotenv';
// For some reason DB envs are not parsed when Nest registers them.
config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * No need to have {DataSource} interface since NestJS/TypeORM driver handles that part
 */
export const ormConfig: TypeOrmModuleOptions = {
  database: Env.isTest ? ':memory:' : process.env.DB_DATABASE,
  type: Env.isTest ? 'sqlite' : 'postgres',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  ...(Env.isTest && {
    synchronize: true,
    fsync: true,
  }),
  entities: [resolveEntityPath()],
  logging: Env.isDev ? 'all' : ['error'],
};
