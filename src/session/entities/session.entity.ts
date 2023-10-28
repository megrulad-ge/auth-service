import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { UpdateDateColumn } from '/common/decorators';
import { User } from '/src/users/entities/user.entity';

@Entity({ name: 'Sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  session: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', comment: 'Will update on every "extend"' })
  expiresAt: Date;

  @Column({ type: 'text' })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
