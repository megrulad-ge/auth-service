import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RegisterResponse {
  @Exclude() id;
  @Exclude() password;
  @Exclude() createdAt;
  @Exclude() updatedAt;
  @Exclude() status;

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
