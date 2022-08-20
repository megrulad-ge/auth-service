import { Module } from '@nestjs/common';
import { SeederService } from './service/seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seed } from './entity/seeder.entity';
import { TestSeedAlterSomeData } from './seeds/TestSeedAlterSomeData';

@Module({
  imports: [TypeOrmModule.forFeature([Seed])],
  providers: [SeederService, TestSeedAlterSomeData],
  exports: [SeederService],
})
export class SeederModule {}
