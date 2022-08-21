import { DocumentBuilder } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../../package.json');

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT auth token',
    in: 'header',
  })
  .setTitle('Auth Service')
  .setDescription('Authentication service')
  .setVersion(packageJson.version)
  .build();
