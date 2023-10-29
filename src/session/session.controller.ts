import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { AuthUser } from '/src/common/decorators/auth-user.decorator';
import { AuthGuard } from '../auth/guards/auth.gueard';
import { SessionService } from './session.service';
import { AuthService } from '../auth/auth.service';
import { UserClaims } from '../users/user.type';
import { RefreshResponse } from '/src/session/response/refresh.response';
import { ExtendRequest } from '/src/session/request/extend.request';
import { ExtendResponse } from '/src/session/response/extend.response';
import { futureDate } from '/common/utils/date.utils';
import { ApiBadRequestResponse } from '/common/decorators/open-api-bad-request.decorator';
import { ApiOkResponse } from '/common/decorators/open-api-ok-response.decorator';
import { ApiNotFoundResponse } from '/common/decorators/open-api-not-found-response.decorator';
import ms from 'ms';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RefreshResponse })
  @ApiUnauthorizedResponse({ description: 'Returns UNAUTHORIZED when the token is invalid or expired' })
  refresh(@AuthUser() { uuid, roles }: UserClaims): RefreshResponse {
    const accessToken = this.authService.signAccessToken(uuid, roles);

    return RefreshResponse.from({
      accessToken: accessToken.value,
      expiresIn: accessToken.expiresIn,
    });
  }

  @Put('extend')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: ExtendResponse })
  async extend(@Body() { refreshToken }: ExtendRequest): Promise<ExtendResponse> {
    const session = await this.sessionService.getBySessionUUID(refreshToken);

    const roles = session.user.roles.map(({ role }) => role.name);
    const expirationDate = futureDate(ms(process.env.REFRESH_TOKEN_EXPIRES_IN));

    await this.sessionService.updateTimestamp(refreshToken, expirationDate);
    const accessToken = this.authService.signAccessToken(session.user.uuid, roles);

    return ExtendResponse.from({
      accessToken: accessToken.value,
      expiresIn: accessToken.expiresIn,
    });
  }
}
