import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { RunReturnType, SeedInterface } from '../interface/seed.interface';

@Injectable()
export abstract class BaseSeed implements SeedInterface {
  protected constructor(@InjectRepository(Seed) protected readonly seedRepository: Repository<Seed>) {}

  get name() {
    return 'DefaultSeedName';
  }

  async run(): Promise<RunReturnType> {
    throw new Error('Method not implemented!');
  }

  async markAsRun(): Promise<void> {
    await this.seedRepository.insert({ name: this.name });
  }

  async hasRun(): Promise<boolean> {
    return (await this.seedRepository.count({ where: { name: this.name } })) > 0;
  }
}
