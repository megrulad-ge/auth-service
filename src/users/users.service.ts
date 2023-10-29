import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityException } from '/common/exceptions/entity.exception';
import { QueryError } from 'mysql2';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  /** @throws EntityException */
  async getByUsername(username: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { username },
        relations: {
          roles: {
            role: true,
          },
        },
      });
    } catch (error) {
      throw new EntityException({
        message: `User with username ${username} not found`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async getByPk(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
        relations: {
          roles: {
            role: true,
          },
        },
      });
    } catch (error) {
      throw new EntityException({
        message: `User with id ${id} not found`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async getByUuid(uuid: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { uuid },
        relations: {
          roles: {
            role: true,
          },
        },
      });
    } catch (error) {
      throw new EntityException({
        message: `User with uuid ${uuid} not found`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async create(username: string, password: string): Promise<User> {
    try {
      return await this.usersRepository.save({
        password,
        username,
      });
    } catch (error: unknown) {
      const { code } = error as QueryError;

      if (code === 'ER_DUP_ENTRY') {
        throw new EntityException({
          message: `User with username ${username} already exists`,
          code: HttpStatus.CONFLICT,
          error,
        });
      }

      throw new EntityException({
        message: `Error creating user with username ${username}`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }
}
