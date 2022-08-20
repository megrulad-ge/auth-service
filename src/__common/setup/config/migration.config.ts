import path = require('path');
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
  type: 'postgres',
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  schema: process.env.DB_SCHEMA,
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: 'all',
  migrations: {
    directory: path.join(__dirname, '../../../../migrations/*.?s'),
  },
} as DataSourceOptions);
