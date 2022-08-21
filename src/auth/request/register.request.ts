import { IsAscii, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @IsString()
  @IsAscii()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({
    description: 'The username of the user',
    example: 'john',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(128)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(128)
  @ApiProperty({
    description: 'The password confirmation of the user',
    example: 'password',
  })
  confirmPassword: string;

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
