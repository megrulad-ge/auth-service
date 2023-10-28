import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiBadRequestResponse } from '/common/decorators';
import { RegisterResponse } from './response/register.response';
import { RegisterRequest } from './request/register.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '/common/utils';
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
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.gueard';

@ApiTags('Authentication')
@Controller('sign')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('up')
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Returns OK when successful', type: RegisterResponse })
  async signUp(@Body() payload: RegisterRequest): Promise<RegisterResponse> {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const userEntity = await this.usersService.create(payload.username, hashedPassword);

    return RegisterResponse.from(userEntity);
  }

  @Post('in')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.OK)
  @ApiUnprocessableEntityResponse({ description: 'Returns 422 when the user is not active' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful', type: Object })
  async signIn(@Body() payload: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.getByUsername(payload.username);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordsMatch = await PasswordUtils.hashCompare(payload.password, user.password);

    if (!passwordsMatch) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== UserStatus.ACTIVE) throw new UnprocessableEntityException('User is not active');

    const roles = user.roles.map(({ role }) => role.name);
    const accessToken = this.authService.signAccessToken(user.uuid, roles);

    const refreshToken = this.authService.getRefreshToken();
    // TODO: Save token into cache with expiration

    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      expiresIn: accessToken.expiresIn,
      refreshTokenExpiresIn: refreshToken.expiresIn,
      roles,
    };
  }

  @Post('out')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async signOut(): Promise<void> {
    // TODO: Implement me, invalidate token, use local or Redis cache.
  }
}
