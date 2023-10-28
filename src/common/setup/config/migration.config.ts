import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

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
  type: 'mysql',
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  entities: [join(process.cwd(), '/dist/**/*.entity.js'), join(process.cwd(), '/dist/**/**/*.entity.js')],
  logging: 'all',
  migrations: {
    directory: join(process.cwd(), '/migrations/*.ts'),
  },
} as DataSourceOptions);
