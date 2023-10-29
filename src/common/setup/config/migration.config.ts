import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { driver } from './orm.config'; // Use relative path here since it is consumed by TypeORM directly.

/**
 * This env file parsing is for development only.
 *
 *
 * In production, even if there is '.env.development' those values would be
 * overridden by system variables itself. When the file is not present,
 * it gets ignored. (no error is thrown)
 */
config({ path: '.env.development' });

/**
 * It requires {DataSource} interface since we are directly using TypeORM library.
 * Unlike `orm.config.ts` where NestJS/TypeORM is handling that part.
 */
export default new DataSource({
  type: driver,
  logging: 'all',
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [join(process.cwd(), '/dist/**/*.entity.js'), join(process.cwd(), '/dist/**/**/*.entity.js')],
  migrations: { directory: join(process.cwd(), '/migrations/*.ts') },
  migrationsTableName: 'Migrations',
} as DataSourceOptions);
