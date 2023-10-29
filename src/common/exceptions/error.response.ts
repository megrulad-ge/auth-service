import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ description: 'HTTP status code', type: Number })
  statusCode: number;

  @ApiProperty({ description: 'Error message', type: String })
  message: string;

  @ApiProperty({ description: 'Error details', type: Object, required: false })
  details: Record<string, unknown> | null;

  constructor(payload: Partial<ErrorResponse>) {
    Object.assign(this, payload);
  }

  static fromError(error: Error): ErrorResponse {
    return new ErrorResponse(error);
  }
}
