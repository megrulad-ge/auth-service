import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '/src/session/entities/session.entity';
import { User } from '/src/users/entities/user.entity';
import { EntityException } from '/common/exceptions/entity.exception';

@Injectable()
export class SessionService {
  constructor(@InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) {}

  /** @throws EntityException */
  async save(session: string, userAgent: string, expiresAt: Date, user: User) {
    try {
      return await this.sessionsRepository.save({
        session,
        userAgent,
        expiresAt,
        user,
      });
    } catch (error) {
      throw new EntityException({
        message: 'Error while saving the session',
        error,
      });
    }
  }

  /**
   * @param {string} session - The session UUID / Refresh token
   * @throws EntityException
   */
  async getBySessionUUID(session: string) {
    try {
      return await this.sessionsRepository.findOneOrFail({
        where: { session },
        relations: {
          user: {
            roles: true,
          },
        },
      });
    } catch (error) {
      throw new EntityException({
        message: 'Error while getting the session',
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  /** @throws EntityException */
  async updateTimestamp(session: string, expiresAt: Date) {
    try {
      return await this.sessionsRepository.update({ session }, { expiresAt });
    } catch (error) {
      throw new EntityException({
        message: 'Error while updating the session',
        code: HttpStatus.CONFLICT,
        error,
      });
    }
  }

  /** @throws EntityException */
  async remove(session: string) {
    try {
      return await this.sessionsRepository.delete({ session });
    } catch (error) {
      throw new EntityException({
        message: 'Error while deleting the session',
        code: HttpStatus.CONFLICT,
        error,
      });
    }
  }
}
