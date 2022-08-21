import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshTokenExpiresIn: number;

  @ApiProperty()
  roles: string[];
}
