import { Module } from '@nestjs/common';
import { SeederService } from './service/seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seed } from './entity/seeder.entity';
import { TestSeedAlterSomeData } from './seeds/TestSeedAlterSomeData';
import { InsertDefaultRoles } from './seeds/InsertDefaultRoles';
import { Role } from '../../../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seed, Role])],
  providers: [SeederService, TestSeedAlterSomeData, InsertDefaultRoles],
  exports: [SeederService],
})
export class SeederModule {}
