import ms from 'ms';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignUpResponse } from './response/sign-up.response';
import { SignUpRequest } from './request/sign-up.request';
import { UsersService } from '../users/users.service';
import { PasswordUtils } from '/common/utils';
import { SignInRequest } from './request/sign-in.request';
import { AuthService } from './auth.service';
import { SignInResponse } from './response/sign-in.response';
import { SessionService } from '/src/session/session.service';
import { SignOutRequest } from '/src/auth/request/sign-out.request';
import { UserAgent } from '/common/decorators/user-agent.decorator';
import { futureDate } from '/common/utils/date.utils';
import { CtxLogger } from '/common/decorators/ctx-logger.decorator';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { ApiConflictResponse } from '/common/decorators/open-api-conflict-response.decorator';
import { ApiUnauthorizedResponse } from '/common/decorators/open-api-unauthorized-response.decorator';
import { ApiUnprocessableEntityResponse } from '/common/decorators/open-api-unprocessable-response.decorator';
import { ApiBadRequestResponse } from '/common/decorators/open-api-bad-request.decorator';
import { ApiCreatedResponse } from '/common/decorators/open-api-created-response.decorator';
import { ApiOkResponse } from '/common/decorators/open-api-ok-response.decorator';
import { ApiNotFoundResponse } from '/common/decorators/open-api-not-found-response.decorator';
import { publicKey } from '/common/setup/keys/asymmetric.keys';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SignUpResponse })
  @ApiConflictResponse({ description: 'Returns UNPROCESSABLE_ENTITY when the user already exists.' })
  @ApiBadRequestResponse({ description: 'Returns BAD_REQUEST when the payload is invalid or malformed.' })
  async signUp(@Body() payload: SignUpRequest) {
    if (!payload.passwordsMatch()) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await PasswordUtils.hashPassword(payload.password);
    const userEntity = await this.usersService.create(payload.username, hashedPassword);

    return SignUpResponse.from(userEntity);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponse })
  @ApiNotFoundResponse({ description: 'Returns NOT_FOUND when the user does not exist.' })
  @ApiBadRequestResponse({ description: 'Returns BAD_REQUEST when the payload is invalid or malformed.' })
  @ApiUnauthorizedResponse({ description: 'Returns UNAUTHORIZED when the credentials are invalid' })
  @ApiUnprocessableEntityResponse({ description: 'Returns UNPROCESSABLE_ENTITY when the user is not active' })
  async signIn(@Body() payload: SignInRequest, @UserAgent() userAgent: string) {
    const user = await this.usersService.getByUsername(payload.username);
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

  @Post('sign-out')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'Returns ACCEPTED when the sign out request is successful' })
  async signOut(@Body() payload: SignOutRequest, @CtxLogger() logger: Logger) {
    await this.sessionService.remove(payload.refreshToken).catch((error) => logger.warn(error.message));
  }

  @Get('.well-known/public-key')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'text/plain')
  @ApiOkResponse({ description: 'Returns the public key used to verify the JWT signature' })
  getPublicKey() {
    return publicKey.toString();
  }
}
