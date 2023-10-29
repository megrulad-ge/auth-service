import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '/src/session/entities/session.entity';
import { User } from '/src/users/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(@InjectRepository(Session) private readonly sessionsRepository: Repository<Session>) {}

  save(session: string, userAgent: string, expiresAt: Date, user: User) {
    return this.sessionsRepository.save({
      session,
      userAgent,
      expiresAt,
      user,
    });
  }

  getBySessionUUID(session: string) {
    return this.sessionsRepository.findOne({
      where: { session },
      relations: {
        user: {
          roles: true,
        },
      },
    });
  }

  updateTimestamp(session: string, expiresAt: Date) {
    return this.sessionsRepository.update({ session }, { expiresAt });
  }

  delete(session: string) {
    return this.sessionsRepository.delete({ session });
  }
}
