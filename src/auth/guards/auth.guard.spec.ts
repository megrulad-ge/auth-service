import { AuthGuard } from '/src/auth/guards/auth.gueard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jsonwebtoken from 'jsonwebtoken';
import { privateKey } from '/common/setup/keys/asymmetric.keys';
import { delay } from '/common/utils/common.utils';

describe('AuthGuard', () => {
  it('should throw when auth header is missing', () => {
    // Arrange
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => null, // No authorization header
        }),
      }),
    } as ExecutionContext;

    const guard = new AuthGuard();

    // Act
    const canActivate = () => guard.canActivate(context);

    // Assert
    expect(canActivate).toThrow(UnauthorizedException);
  });

  it('should throw when token is invalid', () => {
    // Arrange
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => `Bearer invalid-token`,
        }),
      }),
    } as ExecutionContext;

    const guard = new AuthGuard();

    // Act
    const canActivate = () => guard.canActivate(context);

    // Assert
    expect(canActivate).toThrow(UnauthorizedException);
  });

  it('should throw when token is expired', async () => {
    // Arrange
    const token = jsonwebtoken.sign({}, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1s',
    });
    await delay(1500); // Wait for token to expire
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => `Bearer ${token}`,
        }),
      }),
    } as ExecutionContext;

    const guard = new AuthGuard();

    // Act
    const canActivate = () => guard.canActivate(context);

    // Assert, should be expired already
    expect(canActivate).toThrow(UnauthorizedException);
  });

  it('should return true when token is valid', () => {
    // Arrange
    const token = jsonwebtoken.sign({}, privateKey, {
      algorithm: 'RS256',
      expiresIn: '10s',
    });
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => `Bearer ${token}`,
        }),
      }),
    } as ExecutionContext;

    const guard = new AuthGuard();

    // Act
    const canActivate = guard.canActivate(context);

    // Assert
    expect(canActivate).toBeTruthy();
  });
});
