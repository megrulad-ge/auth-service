import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse as OriginalApiConflictResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ErrorResponse } from '/common/exceptions/error.response';

export function ApiConflictResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiConflictResponse({
      description: 'Returns CONFLICT when the resource already exists.',
      type: ErrorResponse,
      ...options,
    }),
  );
}
