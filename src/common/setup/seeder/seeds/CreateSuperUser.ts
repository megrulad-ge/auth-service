import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { Seeds } from '../abstract/seeds.service';
import { Role } from '/src/roles/entities/role.entity';
import { RoleMapping } from '/src/users/entities/role-mapping.entity';
import { User } from '/src/users/entities/user.entity';
import { UserStatus } from '/src/users/user.type';
import { PasswordUtils } from '/common/utils';

@Injectable()
export class CreateSuperUser extends Seeds {
  constructor(
    @InjectRepository(Seed) protected readonly seedRepository: Repository<Seed>,
    @InjectRepository(Role) protected readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleMapping) protected readonly roleMappingRepository: Repository<RoleMapping>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
  ) {
    super(seedRepository);
  }

  get name() {
    return 'Create super user';
  }

  get username() {
    return 'admin';
  }

  async run() {
    const user = await this.createUser();
    await this.assignRoles(user);
  }

  private hashedPassword() {
    return PasswordUtils.hashPassword(process.env.SUPER_USER_PASSWORD || 'admin-123');
  }

  private async createUser() {
    return this.userRepository.save({
      username: this.username,
      password: await this.hashedPassword(),
      status: UserStatus.ACTIVE,
    } as User);
  }

  private async assignRoles(user: User) {
    const roles = await this.roleRepository.find();
    for (const role of roles) {
      await this.roleMappingRepository.save({ user, role });
    }
  }
}
