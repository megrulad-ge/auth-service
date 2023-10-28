import { OpenAPIObject } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import yaml from 'js-yaml';
import fs from 'fs';

export const saveSwaggerDocument = (document: OpenAPIObject) => {
  try {
    const swaggerYaml = yaml.dump(document, { skipInvalid: true });
    fs.writeFileSync('./docs/swagger.yaml', swaggerYaml, 'utf8');
  } catch (error) {
    Logger.error(`Error while writing swagger.yaml file: ${error}`, 'Bootstrap');
  }
};
