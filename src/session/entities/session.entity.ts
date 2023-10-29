import { EnvSpecificDecoratorValue } from '/common/decorators/environment-specific-column.decorator';
import { User } from '/src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from '/common/decorators/column.decorator';
import { CreateDateColumn } from '/common/decorators/create-date-column.decorator';
import { UpdateDateColumn } from '/common/decorators/update-date-column.decorator';

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

  @Column(EnvSpecificDecoratorValue({ type: 'timestamp', comment: 'Will update on every "extend"' }))
  expiresAt: Date;

  @Column({ type: 'text' })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
