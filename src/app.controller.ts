import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/guards/auth.gueard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from './__common/decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@AuthUser() user: unknown) {
    return user;
  }
}
