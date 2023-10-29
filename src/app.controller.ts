import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/guards/auth.gueard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '/common/decorators/auth-user.decorator';
import { UserClaims } from './users/user.type';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@AuthUser() user: UserClaims) {
    return user;
  }
}
