import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse as OriginalApiCreatedResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiCreatedResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiCreatedResponse({
      description: 'Returns CREATED when the resource successfully created.',
      ...options,
    }),
  );
}
