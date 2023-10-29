import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthUser } from '/src/common/decorators/auth-user.decorator';
import { ApiBadRequestResponse, ApiOkResponse } from '/common/decorators';
import { AuthGuard } from '../auth/guards/auth.gueard';
import { SessionService } from './session.service';
import { AuthService } from '../auth/auth.service';
import { UserClaims } from '../users/user.type';
import { RefreshResponse } from '/src/session/response/refresh.response';
import { ExtendRequest } from '/src/session/request/extend.request';
import { ExtendResponse } from '/src/session/response/extend.response';
import { futureDate } from '/common/utils/date.utils';
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
  @ApiOkResponse(RefreshResponse)
  @ApiUnauthorizedResponse({ description: 'Returns 401 when token is invalid or expired' })
  refresh(@AuthUser() { uuid, roles }: UserClaims): RefreshResponse {
    return RefreshResponse.from(this.authService.signAccessToken(uuid, roles));
  }

  @Put('extend')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ description: 'Returns 401 when refreshToken is invalid or expired' })
  @ApiOkResponse(ExtendResponse)
  async extend(@Body() { refreshToken }: ExtendRequest): Promise<ExtendResponse> {
    const session = await this.sessionService.getBySessionUUID(refreshToken);

    if (!session) throw new UnauthorizedException('Invalid/Expired refreshToken');

    const roles = session.user.roles.map(({ role }) => role.name);
    const expirationDate = futureDate(ms(process.env.REFRESH_TOKEN_EXPIRES_IN));

    await this.sessionService.updateTimestamp(refreshToken, expirationDate);

    return ExtendResponse.from(this.authService.signAccessToken(session.user.uuid, roles));
  }
}
