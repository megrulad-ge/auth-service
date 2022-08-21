import { BadRequestException, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '../__common/decorators';
import { RegisterResponse } from './response/register.response';
import { RegisterRequest } from './request/register.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '../__common/utils';
import { LoginRequest } from './request/login.request';
import { AuthService } from './auth.service';
import { LoginResponse } from './response/login.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('register')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns OK when successful', type: RegisterResponse })
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const userEntity = await this.usersService.create(payload.username, hashedPassword);

    return RegisterResponse.from(userEntity);
  }

  @Post('login')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful', type: Object })
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const userEntity = await this.usersService.getByUsername(payload.username);
    if (!userEntity) throw new BadRequestException('Invalid credentials');

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const passwordsMatch = await PasswordUtils.hashCompare(hashedPassword, userEntity.password);

    if (!passwordsMatch) throw new BadRequestException('Invalid credentials');

    // TODO: Add roles
    const roles = ['user'];

    const accessToken = this.authService.sign(userEntity.uuid, roles);

    return {
      accessToken,
      expiresIn: 3600,
      refreshToken: 'refreshToken',
      refreshTokenExpiresIn: 3600,
      roles,
    };
  }
}
