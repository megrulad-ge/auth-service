import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '/src/auth/guards/auth.gueard';
import { AuthUser } from '/common/decorators/auth-user.decorator';
import { UserClaims } from '/src/users/user.type';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
  @Get('profile')
  getProfile(@AuthUser() user: UserClaims) {
    return user;
  }
}
