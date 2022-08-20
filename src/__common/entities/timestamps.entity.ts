import { CreateDateColumn, UpdateDateColumn } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';
import { TimestampsInterface } from '../interfaces/timestamps.interface';

export abstract class TimestampsEntity implements TimestampsInterface {
  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2022-04-25T08:34:33.315Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
