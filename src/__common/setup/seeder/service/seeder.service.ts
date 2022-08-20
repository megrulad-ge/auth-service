import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { TestSeedAlterSomeData } from '../seeds/TestSeedAlterSomeData';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger('SeederService');

  constructor(private readonly alterSomeData: TestSeedAlterSomeData) {}

  async onApplicationBootstrap() {
    return this.seed();
  }

  get loggerRef() {
    return this.logger;
  }

  async seed() {
    // When there is a new seed, add it here
    const seeds: Promise<{ hasRun: boolean; name: string; error?: string }>[] = [this.alterSomeData.run()];

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
