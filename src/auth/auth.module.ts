import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { privateKey, publicKey } from '../__common/setup/keys/asymmetric.keys';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      privateKey,
      publicKey,
      signOptions: {
        expiresIn: '32m',
        algorithm: 'RS256',
      },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
