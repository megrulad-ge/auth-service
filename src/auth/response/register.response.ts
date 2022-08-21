import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  username: string;

  constructor(payload: Partial<RegisterResponse>) {
    Object.assign(this, payload);
  }

  static from(payload: Partial<RegisterResponse>) {
    return new RegisterResponse(payload);
  }
}
