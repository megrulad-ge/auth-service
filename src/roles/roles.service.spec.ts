import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { SetupModule } from '/common/setup/setup.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '/src/roles/entities/role.entity';
import { DataSource } from 'typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let connection: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, TypeOrmModule.forFeature([Role])],
      providers: [RolesService],
    }).compile();

    await module.init();

    service = module.get(RolesService);
    connection = module.get(DataSource);
  });

  afterEach(() => connection.destroy());

  describe('findByPk', () => {
    it('should return a role', async () => {
      // Arrange
      const roleId = 1;

      // Act
      const role = await service.findByPk(roleId);

      // Assert
      expect(role).toBeDefined();
    });

    it('should throw an error if the role does not exist', async () => {
      // Arrange
      const roleId = 999;

      // Act
      const role = service.findByPk(roleId);

      // Assert
      await expect(role).rejects.toThrow();
    });
  });

  describe('findByName', () => {
    it('should return a role', async () => {
      // Arrange
      const roleName = 'Admin'; // Seeder has this role

      // Act
      const role = await service.findByName(roleName);

      // Assert
      expect(role).toBeDefined();
    });

    it('should throw an error if the role does not exist', async () => {
      // Arrange
      const roleName = 'not-existing-role';

      // Act
      const role = service.findByName(roleName);

      // Assert
      await expect(role).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a role', async () => {
      // Arrange
      const roleName = 'New role';
      const roleDescription = 'New role description';

      // Act
      const role = await service.create(roleName, roleDescription);

      // Assert
      expect(role).toBeDefined();
      expect(role).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: roleName,
          description: roleDescription,
        }),
      );
    });

    it('should throw an error if the role already exists', async () => {
      // Arrange
      const roleName = 'Admin'; // Seeder has this role, duplication will throw an error

      // Act
      const role = service.create(roleName);

      // Assert
      await expect(role).rejects.toThrow();
    });
  });

  describe('markAsLocked', () => {
    it('should lock a role', async () => {
      // Arrange
      const roleId = 1;

      // Act
      const result = await service.markAsLocked(roleId);

      // Assert
      expect(result).toBeDefined();
      expect(result.affected).toBe(1);
    });

    it('should throw an error if the role does not exist', async () => {
      // Arrange
      const roleId = 999;
      const repository = connection.getRepository(Role);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error('Some error'));

      // Act
      const result = service.markAsLocked(roleId);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('markAsOpen', () => {
    it('should open a role', async () => {
      // Arrange
      const roleId = 1;

      // Act
      const result = await service.markAsOpen(roleId);

      // Assert
      expect(result).toBeDefined();
      expect(result.affected).toBe(1);
    });

    it('should throw an error if the role does not exist', async () => {
      // Arrange
      const roleId = 999;
      const repository = connection.getRepository(Role);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error('Some error'));

      // Act
      const result = service.markAsOpen(roleId);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
