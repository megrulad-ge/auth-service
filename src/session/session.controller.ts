import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Controller, Post, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthUser } from '/common/decorators/user.decorator';
import { ApiBadRequestResponse, ApiOkResponse } from '/common/decorators';
import { AuthGuard } from '../auth/guards/auth.gueard';
import { SessionService } from './session.service';
import { AuthService } from '../auth/auth.service';
import { UserClaims } from '../users/user.type';
import { RefreshResponse } from '/src/session/response/refresh.response';
import { ExtendRequest } from '/src/session/request/extend.request';
import { ExtendResponse } from '/src/session/response/extend.response';

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

  @Post('extend')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ description: 'Returns 401 when refreshToken is invalid or expired' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful' })
  extend(@Body() { uuid }: ExtendRequest): ExtendResponse {
    // TODO
    // Fetch user details from DB
    // Extend session
    const role = ['role'];

    return ExtendResponse.from(this.authService.signAccessToken(uuid, role));
  }
}
