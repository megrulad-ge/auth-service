import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { BaseSeed } from '../abstract/BaseSeed';
import { RunReturnType, SeedInterface } from '../interface/seed.interface';

@Injectable()
export class TestSeedAlterSomeData extends BaseSeed implements SeedInterface {
  constructor(@InjectRepository(Seed) protected readonly seedRepository: Repository<Seed>) {
    super(seedRepository);
  }

  override get name() {
    return 'TestSeedAlterSomeData';
  }

  override async run(): Promise<RunReturnType> {
    if (await super.hasRun()) return { hasRun: false, name: this.name };
    const message = { hasRun: true, name: this.name, error: `Seeder query failed [${this.name}]` };

    // Run DB operations here
    const queryResult = 'Result';
    // Mark as run when it is done
    await super.markAsRun();

    if (queryResult) delete message.error;

    return message;
  }
}
