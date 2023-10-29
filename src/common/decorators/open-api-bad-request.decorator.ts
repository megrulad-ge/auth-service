import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse as OriginalApiBadRequestResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ErrorResponse } from '/common/exceptions/error.response';

export function ApiBadRequestResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiBadRequestResponse({
      description: 'Returns BAD_REQUEST when the payload is invalid or malformed.',
      type: ErrorResponse,
      ...options,
    }),
  );
}
