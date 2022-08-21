import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  sign(uuid: string, roles: string[]): string {
    return this.jwtService.sign({ uuid, roles });
  }
}
