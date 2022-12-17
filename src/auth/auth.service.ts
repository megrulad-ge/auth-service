import { privateKey } from '../__common/setup/keys/asymmetric.keys';
import { Injectable } from '@nestjs/common';
import jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AuthService {
  sign(uuid: string, roles: string[]): string {
    return jsonwebtoken.sign(
      {
        uuid,
        roles,
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '32m',
      },
    );
  }
}
