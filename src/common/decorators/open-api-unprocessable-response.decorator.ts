import { applyDecorators } from '@nestjs/common';
import {
  ApiUnprocessableEntityResponse as OriginalApiUnprocessableEntityResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { ErrorResponse } from '/common/exceptions/error.response';

export function ApiUnprocessableEntityResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    OriginalApiUnprocessableEntityResponse({
      description: 'Returns UNPROCESSABLE_ENTITY when the payload is valid but the request cannot be processed.',
      type: ErrorResponse,
      ...options,
    }),
  );
}
