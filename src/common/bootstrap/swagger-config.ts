import { DocumentBuilder } from '@nestjs/swagger';
import packageJson from '../../../package.json';

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
