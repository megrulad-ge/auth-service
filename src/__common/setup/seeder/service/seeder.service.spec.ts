import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { SetupModule } from '../../setup.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { TestSeedAlterSomeData } from '../seeds/TestSeedAlterSomeData';

describe('SeederService', () => {
  let service: SeederService;
  let connection: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SetupModule, TypeOrmModule.forFeature([Seed])],
      providers: [SeederService, TestSeedAlterSomeData],
    }).compile();
    connection = module.get<DataSource>(DataSource);
    service = module.get<SeederService>(SeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.seed).toBeDefined();
  });

  it('should seed the database', async () => {
    await service.seed();
    const seedRepository = connection.getRepository(Seed);
    const seeds = await seedRepository.count();
    expect(seeds).toBeGreaterThanOrEqual(1);
  });
});
