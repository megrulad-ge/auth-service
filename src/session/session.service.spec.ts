import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { DataSource, Repository } from 'typeorm';
import { SetupModule } from '/common/setup/setup.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '/src/session/entities/session.entity';
import { User } from '/src/users/entities/user.entity';

describe('SessionService', () => {
  let service: SessionService;
  let connection: DataSource;
  let sessionsRepository: Repository<Session>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, TypeOrmModule.forFeature([Session])],
      providers: [SessionService],
    }).compile();

    await module.init();

    service = module.get(SessionService);
    connection = module.get(DataSource);
    sessionsRepository = connection.getRepository(Session);
    usersRepository = connection.getRepository(User);
  });

  afterEach(() => connection.destroy());

  describe('save', () => {
    it('should save a session', async () => {
      // Arrange
      const session = 'session';
      const userAgent = 'userAgent';
      const expiresAt = new Date();
      const username = 'username-123';
      const password = 'password-123';
      const user = await usersRepository.save({
        username,
        password,
      });

      // Act
      const saved = await service.save(session, userAgent, expiresAt, user);

      // Assert
      expect(saved).toBeDefined();
      expect(saved).toEqual(
        expect.objectContaining({
          session,
          userAgent,
          expiresAt,
        }),
      );
    });

    it('should throw', async () => {
      // Arrange
      jest.spyOn(sessionsRepository, 'save').mockRejectedValueOnce(new Error('Error while saving the session'));

      // Act
      const save = service.save('session', 'userAgent', new Date(), { id: 1 } as any);

      // Assert
      await expect(save).rejects.toThrow();
    });
  });

  describe('getBySessionUUID', () => {
    it('should return a session by session uuid with user and roles', async () => {
      // Arrange
      const session = 'session';
      const userAgent = 'userAgent';
      const expiresAt = new Date();
      const username = 'username-123';
      const password = 'password-123';
      const user = await usersRepository.save({ username, password });
      const saved = await service.save(session, userAgent, expiresAt, user);

      // Act
      const found = await service.getBySessionUUID(saved.session);

      // Assert
      expect(found).toBeDefined();
      expect(found).toEqual(
        expect.objectContaining({
          session,
          userAgent,
          expiresAt,
          user: expect.objectContaining({
            username,
            roles: expect.any(Array), // It's empty but has to present
          }),
        }),
      );
    });

    it('should throw', async () => {
      // Act
      const getBySessionUUID = service.getBySessionUUID('not-found-session');

      // Assert
      await expect(getBySessionUUID).rejects.toThrow();
    });
  });

  describe('updateTimestamp', () => {
    it('should update the timestamp of a session by session uuid', async () => {
      // Arrange
      const session = 'session';
      const userAgent = 'userAgent';
      const expiresAt = new Date();
      const username = 'username-123';
      const password = 'password-123';
      const newExpiresAt = new Date('2256-12-26'); // 26th December 2256
      const user = await usersRepository.save({ username, password });
      const saved = await service.save(session, userAgent, expiresAt, user);

      // Act
      await service.updateTimestamp(saved.session, newExpiresAt);

      // Assert
      const found = await service.getBySessionUUID(saved.session);
      expect(found).toBeDefined();
      expect(found.expiresAt).toEqual(newExpiresAt);
    });

    it('should throw', async () => {
      // Arrange
      jest.spyOn(sessionsRepository, 'update').mockRejectedValueOnce(new Error('Error while updating the session'));

      // Act
      const updateTimestamp = service.updateTimestamp('correct-session', new Date());

      // Assert
      await expect(updateTimestamp).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a session by session uuid', async () => {
      // Arrange
      const session = 'session';
      const userAgent = 'userAgent';
      const expiresAt = new Date();
      const username = 'username-123';
      const password = 'password-123';
      const user = await usersRepository.save({ username, password });
      const saved = await service.save(session, userAgent, expiresAt, user);

      // Act
      const removed = await service.remove(saved.session);

      // Assert
      expect(removed).toBeDefined();
      expect(removed.affected).toEqual(1);
    });

    it('should throw', async () => {
      // Arrange
      jest.spyOn(sessionsRepository, 'delete').mockRejectedValueOnce(new Error('Error while deleting the session'));

      // Act
      const remove = service.remove('correct-session');

      // Assert
      await expect(remove).rejects.toThrow();
    });
  });
});
