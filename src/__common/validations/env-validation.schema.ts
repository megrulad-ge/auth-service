import Joi from 'joi';
import { NodeEnv } from '../types';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid(NodeEnv.TEST, NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.DEBUG)
    .label('Node environment')
    .required(),

  PORT: Joi.number().positive().less(65536).label('Server port number').required(),

  ORIGIN: Joi.string()
    .required()
    .label('Allowed Origins')
    .description('Comma-separated origin string list')
    .example('http://localhost:4200,http://localhost:3000'),

  AUTH_SERVICE_URL: Joi.string()
    .required()
    .label('Auth service url')
    .description('Auth service url')
    .example('http://localhost:3000'),

  DB_HOST: Joi.string().required().label('Database host').example('localhost'),
  DB_PORT: Joi.number().required().label('Database port').example(5432),
  DB_USERNAME: Joi.string().required().label('Database user').example('db-user'),
  DB_PASSWORD: Joi.string().required().label('Database password').example('db-password'),
  DB_DATABASE: Joi.string().required().label('Database name').example('database'),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
