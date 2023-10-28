import { Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Column, UpdateDateColumn, CreateDateColumn } from '/common/decorators';
import { UserStatus } from '../user.type';
import { RoleMapping } from './role-mapping.entity';
import { Session } from '/src/session/entities/session.entity';

@Entity({ name: 'Users' })
@Index(['uuid', 'username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 64, unique: true, nullable: true, default: null })
  email: string | null;

  @Column({ type: 'varchar', length: 1024 })
  password: string;

  @Column({ type: 'varchar', length: 16, default: UserStatus.PENDING })
  status: UserStatus;

  @OneToMany(() => RoleMapping, (role) => role.user, { nullable: true })
  roles: RoleMapping[];

  @OneToMany(() => Session, (session) => session.user, { nullable: true })
  sessions: Session[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isPending(): boolean {
    return this.status === UserStatus.PENDING;
  }

  isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED;
  }

  isRemoved(): boolean {
    return this.status === UserStatus.REMOVED;
  }
}
