import path = require('path');
import { config } from 'dotenv';

config({ path: '.env.development' });
/**
 * UML diagram generator is using TypeORM version 0.2 (not v0.3). Since it was listed as a Peer Dependency it was not
 * possible to have two versions of TypeORM. For that reason it was aliased as 'typeorm-v2' which is using v0.2
 * under the hood but the main dependency is v0.3. It can be updated once 'typeorm-uml' supports v0.3 but meanwhile
 * its peer dependency in package-lock.json is manually altered.
 *
 *
 * That is the reason that it is required to use a separate configuration file.
 */
export = {
  type: 'postgres',
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: +process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  schema: process.env.PGSCHEMA,
  entities: [path.join(__dirname, '../../../../src/**/*.entity{.ts,.js}')],
  logging: 'all',
  cli: {
    migrationsDir: 'migrations',
  },
};
