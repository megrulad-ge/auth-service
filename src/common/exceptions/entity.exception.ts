import { HttpStatus } from '@nestjs/common';

export type ErrorPayloadType = {
  message: string;
  error?: unknown | null;
  code?: HttpStatus;
};

export class EntityException extends Error {
  /**
   * @description Error details
   *
   * It is meant to be logged internally, not to be exposed to the user.
   *
   * On the other hand, the `message` property is meant to be exposed to the user.
   */
  readonly details: Record<string, unknown>;
  readonly code?: number;

  constructor(exception: ErrorPayloadType) {
    super(exception.message);

    this.code = exception.code;
    this.name = this.constructor.name;
    this.details = this.extractDetails(exception);

    Error.captureStackTrace(this, this.constructor);
  }

  private extractDetails(exception: ErrorPayloadType): Record<string, unknown> {
    const extracted = {
      message: this.message,
      error: 'Empty',
    };
    if (exception.error instanceof Error) extracted.error = exception.error.message;
    else if (typeof exception.error === 'string') extracted.error = exception.error;
    else if (typeof exception.error === 'object') extracted.error = JSON.stringify(exception.error);

    return extracted;
  }
}
