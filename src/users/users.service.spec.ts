import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SetupModule } from '/common/setup/setup.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '/src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let connection: DataSource;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    await module.init();

    connection = module.get(DataSource);
    service = module.get(UsersService);
    usersRepository = connection.getRepository(User);
  });

  afterEach(() => connection.destroy());

  describe('getByUsername', () => {
    it('should return a user by username with roles', async () => {
      const user = await service.getByUsername('admin');

      expect(user).toBeDefined();
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          username: 'admin',
          email: null,
          roles: expect.any(Array),
          password: expect.any(String),
          status: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('throw an error if the user does not exist', async () => {
      await expect(service.getByUsername('NotExistingUser')).rejects.toThrow();
    });
  });

  describe('getByPk', () => {
    it('should return a user by primary key with roles', async () => {
      const user = await service.getByPk(1); // admin should be there

      expect(user).toBeDefined();
      expect(user).toEqual(
        expect.objectContaining({
          username: 'admin',
          roles: expect.any(Array),
        }),
      );
    });

    it('throw an error if the user does not exist', async () => {
      // Assuming there is no user with id 999 😬
      await expect(service.getByPk(999)).rejects.toThrow();
    });
  });

  describe('getByUuid', () => {
    it('should return a user by uuid with roles', async () => {
      // Arrange
      const uuid = 'b3c2e2a0-7f9d-11eb-9439-0242ac130002';
      jest.spyOn(usersRepository, 'findOneOrFail').mockResolvedValueOnce({
        id: 1,
        uuid,
      } as User);

      // Act
      const user = await service.getByUuid(uuid);

      // Assert
      expect(user).toBeDefined();
    });

    it('throw an error if the user does not exist', async () => [
      await expect(service.getByUuid('NotExistingUuid')).rejects.toThrow(),
    ]);
  });

  describe('create', () => {
    it('should create a user with the given username, email, password and status', async () => {
      // Arrange
      const username = 'my-user';
      const password = 'my-password';

      // Act
      const user = await service.create(username, password);

      // Assert
      expect(user).toBeDefined();
      expect(user).toEqual(expect.objectContaining({ username }));
    });

    it('throw an error if the user already exists with the given username or email', async () => {
      // Arrange
      const username = 'admin';
      const password = 'my-password';

      // Act, Assert
      await expect(service.create(username, password)).rejects.toThrow();
    });
  });
});
