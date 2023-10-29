import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '10h';
  });

  describe('signAccessToken', () => {
    it('should return a signed access token', () => {
      const accessToken = service.signAccessToken('uuid', ['admin']);

      expect(accessToken).toBeDefined();
      expect(accessToken).toEqual(
        expect.objectContaining({
          value: expect.any(String),
          expiresIn: 600, // 10 minutes in seconds
        }),
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should return a refresh token', () => {
      const refreshToken = service.getRefreshToken();

      expect(refreshToken).toBeDefined();
      expect(refreshToken).toEqual(
        expect.objectContaining({
          value: expect.any(String),
          expiresIn: 36000, // 10 hours in seconds
        }),
      );
    });
  });
});
