import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponse {
  @ApiProperty({ type: 'string', example: 'aaa.bbb.ccc' })
  accessToken: string;

  @ApiProperty({ type: 'number', example: 3600 })
  expiresIn: number;

  constructor(payload: Partial<RefreshResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<RefreshResponse>) {
    return new RefreshResponse(payload);
  }
}
