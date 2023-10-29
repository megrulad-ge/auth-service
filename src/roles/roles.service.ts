import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleStatus } from '../users/user.type';
import { EntityException } from '/common/exceptions/entity.exception';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  /** @throws EntityException */
  async findByPk(id: number) {
    try {
      return await this.roleRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new EntityException({
        message: `Role with id ${id} not found`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async findByName(name: string) {
    try {
      return await this.roleRepository.findOneByOrFail({ name });
    } catch (error) {
      throw new EntityException({
        message: `Role with name ${name} not found`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async create(name: string, description: string = null) {
    try {
      return await this.roleRepository.save({ name, description });
    } catch (error) {
      throw new EntityException({
        message: 'Error while creating the role',
        code: HttpStatus.CONFLICT,
        error,
      });
    }
  }

  /** @throws EntityException */
  async markAsLocked(id: number) {
    try {
      return await this.roleRepository.update({ id }, { status: RoleStatus.LOCKED });
    } catch (error) {
      throw new EntityException({
        message: 'Error while locking the role',
        code: HttpStatus.CONFLICT,
        error,
      });
    }
  }

  /** @throws EntityException */
  async markAsOpen(id: number) {
    try {
      return await this.roleRepository.update({ id }, { status: RoleStatus.OPEN });
    } catch (error) {
      throw new EntityException({
        message: 'Error while opening the role',
        code: HttpStatus.CONFLICT,
        error,
      });
    }
  }
}
