import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';

@Injectable()
export abstract class Seeds {
  protected constructor(@InjectRepository(Seed) protected readonly seedRepository: Repository<Seed>) {}

  abstract get name(): string;

  abstract run(): Promise<void>;

  async markAsRun(): Promise<void> {
    await this.seedRepository.insert({ name: this.name });
  }

  async hasRun(): Promise<boolean> {
    return (await this.seedRepository.count({ where: { name: this.name } })) > 0;
  }
}
