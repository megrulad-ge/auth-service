import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '/src/auth/auth.service';
import { UsersModule } from '/src/users/users.module';
import { SessionModule } from '/src/session/session.module';
import { SignUpRequest } from '/src/auth/request/sign-up.request';
import { SetupModule } from '/common/setup/setup.module';
import { SignInRequest } from '/src/auth/request/sign-in.request';
import { SignOutRequest } from '/src/auth/request/sign-out.request';
import { Session } from '/src/session/entities/session.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let connection: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, UsersModule, SessionModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '10h';
    process.env.SUPER_USER_PASSWORD = 'secret';
    // Init hook will run seeds and 'admin:secret' will be created
    await module.init();

    controller = module.get(AuthController);
    connection = module.get(DataSource);
  });

  describe('signUp', () => {
    it('should return a signed access token', async () => {
      // Arrange
      const requestBody = SignUpRequest.from({
        username: 'username',
        password: 'password',
        confirmPassword: 'password',
      });

      // Act
      const response = await controller.signUp(requestBody);

      // Assert
      expect(response).toBeDefined();
      expect(response).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          username: requestBody.username,
        }),
      );
    });

    it('should throw an error if the passwords do not match', async () => {
      // Arrange
      const requestBody = SignUpRequest.from({
        username: 'username',
        password: 'password',
        confirmPassword: 'not-matching-password',
      });

      // Act, Assert
      await expect(controller.signUp(requestBody)).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('should sign-in successfully', async () => {
      // Arrange
      const payload = SignInRequest.from({
        username: 'admin',
        password: 'secret',
      });

      // Act
      const response = await controller.signIn(payload, 'user-agent');

      // Assert
      expect(response).toBeDefined();
      expect(response).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          expiresIn: expect.any(Number),
          refreshTokenExpiresIn: expect.any(Number),
          roles: expect.any(Array),
        }),
      );
    });

    it('should throw an error if the passwords do not match', async () => {
      // Arrange
      const payload = SignInRequest.from({
        username: 'admin',
        password: 'wrong-password',
      });

      // Act, Assert
      await expect(controller.signIn(payload, 'user-agent')).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if the user does not exist', async () => {
      // Arrange
      const payload = SignInRequest.from({
        username: 'not-existing-user',
        password: 'password',
      });

      // Act, Assert
      await expect(controller.signIn(payload, 'user-agent')).rejects.toThrow();
    });

    it('should throw an error if the user is not active', async () => {
      // Arrange
      // User is created, but it's inactive by default, required admin approval
      await controller.signUp(
        SignUpRequest.from({
          username: 'new-user',
          password: 'password',
          confirmPassword: 'password',
        }),
      );
      const payload = SignInRequest.from({
        username: 'new-user',
        password: 'password',
      });

      // Act, Assert
      await expect(controller.signIn(payload, 'user-agent')).rejects.toThrow('User is not active');
    });
  });

  describe('signOut', () => {
    it('should sign-out successfully', async () => {
      // Arrange
      const userAgent = 'user-agent';
      const signIn = await controller.signIn(
        SignInRequest.from({
          username: 'admin',
          password: 'secret',
        }),
        userAgent,
      );
      const payload = SignOutRequest.from({
        refreshToken: signIn.refreshToken,
      });
      const logger = {
        warn: () => {},
      } as unknown;
      const repository = connection.getRepository(Session);

      // Act
      await controller.signOut(payload, logger as Logger);

      // Assert
      await expect(repository.findOneBy({ session: signIn.refreshToken })).resolves.toBeNull();
    });

    it('should log warning', async () => {
      // Arrange
      const repository = connection.getRepository(Session);
      const payload = SignOutRequest.from({
        refreshToken: 'not-existing-refresh-token',
      });
      const warn = jest.fn();
      const logger = { warn } as unknown;
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error('Error while deleting the session'));

      // Act
      await controller.signOut(payload, logger as Logger);

      // Assert
      expect(warn).toHaveBeenCalled();
    });
  });
});
