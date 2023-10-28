import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse as OriginalApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiOkResponse(type: any, options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiOkResponse({
      description: 'Returns SUCCESS when the request is successful.',
      type,
      ...options,
    }),
  );
}
