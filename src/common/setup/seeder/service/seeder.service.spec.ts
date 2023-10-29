import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { SetupModule } from '../../setup.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { Role } from '/src/roles/entities/role.entity';
import { User } from '/src/users/entities/user.entity';
import { RoleMapping } from '/src/users/entities/role-mapping.entity';
import { InsertDefaultRoles } from '/common/setup/seeder/seeds/InsertDefaultRoles';
import { CreateSuperUser } from '/common/setup/seeder/seeds/CreateSuperUser';

describe('SeederService', () => {
  let service: SeederService;
  let connection: DataSource;
  let usersRepository: Repository<User>;
  let rolesRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, TypeOrmModule.forFeature([Seed, Role, User, RoleMapping])],
      providers: [SeederService, InsertDefaultRoles, CreateSuperUser],
    }).compile();
    connection = module.get<DataSource>(DataSource);
    service = module.get<SeederService>(SeederService);
    usersRepository = connection.getRepository(User);
    rolesRepository = connection.getRepository(Role);
  });

  afterEach(() => connection.destroy());

  it('should seed the database', async () => {
    // Arrange
    const seedRepository = connection.getRepository(Seed);

    // Act
    await service.seed();

    // Assert
    const seeds = await seedRepository.count();
    const users = await usersRepository.count();
    const roles = await rolesRepository.count();

    expect(seeds).toEqual(2);
    expect(users).toEqual(1);
    expect(roles).toEqual(9);
  });
});
