import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column, CreateDateColumn } from '../../../decorators';

@Entity({ name: 'seeds' })
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;
}
