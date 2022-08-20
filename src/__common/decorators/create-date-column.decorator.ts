import { EnvSpecificDecoratorValue } from './environment-specific-column.decorator';
import { ColumnOptions, CreateDateColumn as OriginalCreateDateColumn } from 'typeorm';

export function CreateDateColumn(columnOptions: ColumnOptions) {
  return OriginalCreateDateColumn(EnvSpecificDecoratorValue(columnOptions));
}
