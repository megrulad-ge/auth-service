import { registerAs } from '@nestjs/config';
import { getConfig } from './orm.config';

export default registerAs('database', () => getConfig());
