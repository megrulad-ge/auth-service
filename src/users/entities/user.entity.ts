import { Entity, Generated, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Column, UpdateDateColumn, CreateDateColumn } from '../../__common/decorators';
import { UserStatus } from '../user.type';
import { RoleMapping } from './user-role.entity';

@Entity({ name: 'users' })
@Index(['uuid', 'username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 1024 })
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @OneToMany(() => RoleMapping, (role) => role.user, { nullable: true })
  roles: RoleMapping[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
