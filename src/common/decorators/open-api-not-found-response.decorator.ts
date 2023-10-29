import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse as OriginalApiNotFoundResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ErrorResponse } from '/common/exceptions/error.response';

export function ApiNotFoundResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiNotFoundResponse({
      description: 'Returns NOT_FOUND when the requested resource is not found.',
      type: ErrorResponse,
      ...options,
    }),
  );
}
