import { ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '../__common/decorators';
import { RegisterResponse } from './response/register.response';
import { RegisterRequest } from './request/register.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '../__common/utils';
import { LoginRequest } from './request/login.request';
import { AuthService } from './auth.service';
import { LoginResponse } from './response/login.response';
import { UserStatus } from '../users/user.type';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';

@ApiTags('Authentication')
@Controller('sign')
export class AuthController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('up')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns OK when successful', type: RegisterResponse })
  async register(@Body() payload: RegisterRequest): Promise<RegisterResponse> {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const userEntity = await this.usersService.create(payload.username, hashedPassword);

    return RegisterResponse.from(userEntity);
  }

  @Post('in')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({ description: 'Returns 422 when the user is not active' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful', type: Object })
  async login(@Body() payload: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.getByUsername(payload.username);

    if (!user) throw new BadRequestException('Invalid credentials');
    if (user.status !== UserStatus.ACTIVE) throw new UnprocessableEntityException('User is not active');

    const passwordsMatch = await PasswordUtils.hashCompare(payload.password, user.password);

    if (!passwordsMatch) throw new BadRequestException('Invalid credentials');

    const roles = user.roles.map(({ role }) => role.name);
    const accessToken = this.authService.sign(user.uuid, roles);

    return {
      accessToken,
      expiresIn: 3600,
      refreshToken: 'refreshToken',
      refreshTokenExpiresIn: 3600,
      roles,
    };
  }

  @Post('out')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiUnauthorizedResponse({ description: 'Returns 401 when token is invalid or expired' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Returns ACCEPTED when successful' })
  async logout(): Promise<void> {
    // TODO: Implement me, invalidate token, use local or Redis cache.
  }
}
