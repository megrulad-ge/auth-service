import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutRequest {
  @ApiProperty({
    description: 'Deactivates the refresh token of the user',
  })
  @IsUUID()
  refreshToken: string;
}
