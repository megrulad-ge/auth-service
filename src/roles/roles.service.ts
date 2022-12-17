import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleStatus } from '../users/user.type';

@Injectable()
export class RolesService {
  // TODO: create another entity for role mappings and modify current entity accordingly
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  findByPk(id: number): Promise<Role> {
    return this.roleRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Role> {
    return this.roleRepository.findOneBy({ name });
  }

  create(name: string, description: string = null): Promise<Role> {
    return this.roleRepository.save({ name, description });
  }

  markAsLocked(id: number): Promise<Role> {
    return this.roleRepository.save({ id, status: RoleStatus.LOCKED });
  }

  markAsOpen(id: number): Promise<Role> {
    return this.roleRepository.save({ id, status: RoleStatus.OPEN });
  }
}
