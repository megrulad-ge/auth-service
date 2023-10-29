import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutRequest {
  @ApiProperty({
    description: 'Deactivates the refresh token of the user',
  })
  @IsUUID()
  refreshToken: string;

  constructor(payload: Partial<SignOutRequest>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignOutRequest>): SignOutRequest {
    return new SignOutRequest(payload);
  }
}
