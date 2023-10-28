import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Controller, Get, Post, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthUser } from '/common/decorators/user.decorator';
import { ApiBadRequestResponse } from '/common/decorators';
import { AuthGuard } from '../auth/guards/auth.gueard';
import { SessionService } from './session.service';
import { AuthService } from '../auth/auth.service';
import { UserClaims } from '../users/user.type';

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
  @ApiUnauthorizedResponse({ description: 'Returns 401 when token is invalid or expired' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful' })
  refresh(@AuthUser() { uuid, roles }: UserClaims) {
    return this.authService.signAccessToken(uuid, roles);
  }

  @Post('extend')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse({ description: 'Returns 401 when refreshToken is invalid or expired' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns OK when successful' })
  extend(@Body() session: { a: string }) {
    // TODO
    // Fetch user uuid from redis
    // Fetch user details from DB
    const uuid = 'uuid';
    const role = ['role'];

    return this.authService.signAccessToken(uuid, role);
  }
}
