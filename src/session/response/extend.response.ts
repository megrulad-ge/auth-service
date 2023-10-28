import { ApiProperty } from '@nestjs/swagger';

export class ExtendResponse {
  @ApiProperty({ type: 'string', example: 'aaa.bbb.ccc' })
  accessToken: string;

  @ApiProperty({ type: 'number', example: 3600 })
  expiresIn: number;

  constructor(payload: Partial<ExtendResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<ExtendResponse>) {
    return new ExtendResponse(payload);
  }
}
