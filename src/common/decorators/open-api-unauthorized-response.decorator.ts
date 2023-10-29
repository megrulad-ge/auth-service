import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse as OriginalApiUnauthorizedResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ErrorResponse } from '/common/exceptions/error.response';

export function ApiUnauthorizedResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiUnauthorizedResponse({
      description: 'Returns UNAUTHORIZED when the user is not authenticated.',
      type: ErrorResponse,
      ...options,
    }),
  );
}
