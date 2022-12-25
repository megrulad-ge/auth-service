import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn } from '../../__common/decorators';
import { User } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'role_mapping' })
export class RoleMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
