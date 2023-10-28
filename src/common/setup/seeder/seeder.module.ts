import { Module } from '@nestjs/common';
import { SeederService } from './service/seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seed } from './entity/seeder.entity';
import { InsertDefaultRoles } from './seeds/InsertDefaultRoles';
import { Role } from '/src/roles/entities/role.entity';
import { CreateSuperUser } from '/common/setup/seeder/seeds/CreateSuperUser';
import { User } from '/src/users/entities/user.entity';
import { RoleMapping } from '/src/users/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seed, Role, User, RoleMapping])],
  providers: [SeederService, InsertDefaultRoles, CreateSuperUser],
  exports: [SeederService],
})
export class SeederModule {}
