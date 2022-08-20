import { OpenAPIObject } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import yaml from 'js-yaml';
import fs from 'fs';

export const saveSwaggerDocument = (document: OpenAPIObject) => {
  try {
    const yamlString = yaml.dump(document);
    fs.writeFileSync('./docs/swagger.yaml', yamlString);
  } catch (error) {
    Logger.error(`Error while writing swagger.yaml file: ${error}`, 'Bootstrap');
  }
};
