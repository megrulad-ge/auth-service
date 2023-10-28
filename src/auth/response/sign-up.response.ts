import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SignUpResponse {
  @Exclude() id;
  @Exclude() password;
  @Exclude() createdAt;
  @Exclude() updatedAt;
  @Exclude() status;
  @Exclude() email;

  @ApiProperty({ type: 'uuid', example: 'd0f5c2c0-0f8a-4f1a-8f0a-2b5b8a0e1c1e' })
  uuid: string;

  @ApiProperty({ type: 'string', example: 'user-123' })
  username: string;

  constructor(payload: Partial<SignUpResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<SignUpResponse>) {
    return new SignUpResponse(payload);
  }
}
