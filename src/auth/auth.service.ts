import { privateKey } from '/common/setup/keys/asymmetric.keys';
import { Injectable } from '@nestjs/common';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import ms from 'ms';

type ReturnType = {
  value: string;
  expiresIn: number;
};
@Injectable()
export class AuthService {
  /**
   * Expiration is in seconds
   */
  signAccessToken(uuid: string, roles: string[]): ReturnType {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn,
    };
    const value = jsonwebtoken.sign(
      {
        uuid,
        roles,
      },
      privateKey,
      options,
    );

    return {
      value,
      expiresIn: ms(expiresIn) / 1000, // convert to seconds,
    };
  }

  /**
   * Expiration is in seconds
   */
  getRefreshToken() {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '1d';
    const value = randomUUID();

    return {
      value,
      expiresIn: ms(expiresIn) / 1000, // convert to seconds,
    };
  }
}
