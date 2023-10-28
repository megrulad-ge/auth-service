import { ApiProperty } from '@nestjs/swagger';

export class SignInResponse {
  @ApiProperty({ type: 'string', example: 'aaa.bbb.ccc' })
  accessToken: string;

  @ApiProperty({ type: 'number', example: 3600 })
  expiresIn: number;

  @ApiProperty({ type: 'string', example: 'aaa.bbb.ccc' })
  refreshToken: string;

  @ApiProperty({ type: 'number', example: 86400 })
  refreshTokenExpiresIn: number;

  @ApiProperty({ type: 'string', example: ['Admin', 'User', 'Guest'], isArray: true })
  roles: string[];

  constructor(payload: Partial<SignInResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignInResponse>) {
    return new SignInResponse(payload);
  }
}
