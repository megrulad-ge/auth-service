import Joi from 'joi';
import { NodeEnv } from '../types';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid(NodeEnv.TEST, NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.DEBUG)
    .label('Node environment')
    .required(),

  PORT: Joi.number().positive().less(65536).label('Server port number').required(),

  ORIGIN: Joi.string()
    .optional()
    .default('')
    .label('Allowed Origins')
    .description('Comma-separated origin string list')
    .example('http://localhost:4200,http://localhost:3000'),

  DB_HOST: Joi.string().required().label('Database host').example('localhost'),
  DB_PORT: Joi.number().required().label('Database port').example(5432),
  DB_USERNAME: Joi.string().required().label('Database user').example('db-user'),
  DB_PASSWORD: Joi.string().required().label('Database password').example('db-password'),
  DB_DATABASE: Joi.string().required().label('Database name').example('database'),

  ACCESS_TOKEN_EXPIRES_IN: Joi.string().example('30m').label('Access token expiration time').required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().example('1d').label('Refresh token expiration time').required(),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
