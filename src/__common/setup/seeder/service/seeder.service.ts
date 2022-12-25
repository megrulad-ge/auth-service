import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { TestSeedAlterSomeData } from '../seeds/TestSeedAlterSomeData';
import { InsertDefaultRoles } from '../seeds/InsertDefaultRoles';
import { RunReturnType } from '../interface/seed.interface';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('SeederService');

  constructor(
    private readonly alterSomeData: TestSeedAlterSomeData,
    private readonly insertDefaultRoles: InsertDefaultRoles,
  ) {}

  async onApplicationBootstrap() {
    return this.seed();
  }

  async seed() {
    // When there is a new seed, add it here
    const seeds: Promise<RunReturnType>[] = [this.alterSomeData.run(), this.insertDefaultRoles.run()];

    await Promise.all(seeds).then((operations) => {
      operations.forEach((operation) => {
        if (operation.hasRun) {
          if (operation.error) {
            return this.logger.warn(
              `[Seed][${operation.name}] Operation has been failed with error: ${operation.error}!`,
            );
          } else {
            return this.logger.log(`[Seed][${operation.name}] Operation has been run!`);
          }
        }

        this.logger.log(`[Seed][${operation.name}] Operation has been skipped!`);
      });
    });
  }
}
