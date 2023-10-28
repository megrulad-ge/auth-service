import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SignUpResponse } from './response/sign-up.response';
import { RegisterRequest } from './request/register.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '/common/utils';
import { LoginRequest } from './request/login.request';
import { AuthService } from './auth.service';
import { SignInResponse } from './response/sign-in.response';
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
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '/common/decorators';

@ApiTags('Authentication')
@Controller('sign')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse(SignUpResponse)
  @ApiBadRequestResponse({ description: 'Returns 400 when the payload is invalid or malformed.' })
  async signUp(@Body() payload: RegisterRequest) {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const userEntity = await this.usersService.create(payload.username, hashedPassword);

    return SignUpResponse.from(userEntity);
  }

  @Post('in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse(SignInResponse)
  @ApiBadRequestResponse({ description: 'Returns 400 when the payload is invalid or malformed.' })
  @ApiUnauthorizedResponse({ description: 'Returns 401 when the credentials are invalid' })
  @ApiUnprocessableEntityResponse({ description: 'Returns 422 when the user is not active' })
  async signIn(@Body() payload: LoginRequest) {
    const user = await this.usersService.getByUsername(payload.username);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordsMatch = await PasswordUtils.hashCompare(payload.password, user.password);

    if (!passwordsMatch) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive()) throw new UnprocessableEntityException('User is not active');

    const roles = user.roles.map(({ role }) => role.name);
    const accessToken = this.authService.signAccessToken(user.uuid, roles);

    const refreshToken = this.authService.getRefreshToken();
    // TODO: Save token into cache with expiration

    return SignInResponse.from({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      expiresIn: accessToken.expiresIn,
      refreshTokenExpiresIn: refreshToken.expiresIn,
      roles,
    });
  }

  @Post('out')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiNotFoundResponse({ description: 'Returns 404 when the token is not found' })
  @ApiAcceptedResponse({ description: 'Returns 202 when the token is invalidated successfully' })
  async signOut(): Promise<void> {
    // TODO: Implement me, invalidate token, use local or Redis cache.
  }
}
