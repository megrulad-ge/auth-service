import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SignUpResponse } from './response/sign-up.response';
import { SignUpRequest } from './request/sign-up.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '/common/utils';
import { SignInRequest } from './request/sign-in.request';
import { AuthService } from './auth.service';
import { SignInResponse } from './response/sign-in.response';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.gueard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '/common/decorators';
import { SessionService } from '/src/session/session.service';
import { SignOutRequest } from '/src/auth/request/sign-out.request';
import { UserAgent } from '/common/decorators/user-agent.decorator';
import ms from 'ms';
import { futureDate } from '/common/utils/date.utils';
import { CtxLogger } from '/common/decorators/ctx-logger.decorator';

@ApiTags('Authentication')
@Controller('sign')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse(SignUpResponse)
  @ApiBadRequestResponse({ description: 'Returns 400 when the payload is invalid or malformed.' })
  async signUp(@Body() payload: SignUpRequest) {
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
  async signIn(@Body() payload: SignInRequest, @UserAgent() userAgent: string) {
    const user = await this.usersService.getByUsername(payload.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const passwordsMatch = await PasswordUtils.hashCompare(payload.password, user.password);

    if (!passwordsMatch) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive()) throw new UnprocessableEntityException('User is not active');

    const roles = user.roles.map(({ role }) => role.name);
    const accessToken = this.authService.signAccessToken(user.uuid, roles);

    const refreshToken = this.authService.getRefreshToken();
    const expirationDate = futureDate(ms(process.env.REFRESH_TOKEN_EXPIRES_IN));

    await this.sessionService.save(refreshToken.value, userAgent, expirationDate, user);

    return SignInResponse.from({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      expiresIn: accessToken.expiresIn,
      refreshTokenExpiresIn: refreshToken.expiresIn,
      roles,
    });
  }

  @Post('out')
  @HttpCode(HttpStatus.ACCEPTED)
  signOut(@Body() payload: SignOutRequest, @CtxLogger() logger: Logger) {
    this.sessionService.delete(payload.refreshToken).catch((error) => logger.warn(error.message));
  }
}
