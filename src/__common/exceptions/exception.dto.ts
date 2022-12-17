import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ErrorNotFound {
  @ApiProperty({
    required: true,
    description: 'HTTP status code',
    example: 404,
  })
  @IsNotEmpty()
  @IsString()
  statusCode: number;

  @ApiProperty({
    required: true,
    description: 'HTTP status message',
    example: 'Not found',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ErrorUnauthorized {
  @ApiProperty({
    required: true,
    description: 'HTTP status code',
    example: 401,
  })
  @IsNotEmpty()
  @IsString()
  statusCode: number;

  @ApiProperty({
    required: true,
    description: 'HTTP status message',
    example: 'Unauthorized',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ErrorBadRequest {
  @ApiProperty({
    required: true,
    description: 'HTTP status code',
    example: 400,
  })
  @IsNotEmpty()
  @IsString()
  statusCode: number;

  @ApiProperty({
    required: true,
    description: 'HTTP status message',
    example: 'Bad request',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
