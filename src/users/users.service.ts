import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  getByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  getByPk(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  getByUuid(uuid: string): Promise<User> {
    return this.usersRepository.findOneBy({ uuid });
  }

  create(username: string, password: string): Promise<User> {
    return this.usersRepository.save({
      password,
      username,
    });
  }
}
