import { Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Column, UpdateDateColumn, CreateDateColumn } from '../../__common/decorators';

import { UserStatus } from '../user.type';
import { Role } from './role.entity';

@Entity({ name: 'users' })
@Index(['uuid'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 64 })
  username: string;

  @Column({ type: 'varchar', length: 1024 })
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @OneToMany(() => Role, (role) => role.user, { nullable: true })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
