import { EnvSpecificDecoratorValue } from './environment-specific-column.decorator';
import { ColumnOptions, UpdateDateColumn as OriginalUpdateDateColumn } from 'typeorm';

export function UpdateDateColumn(columnOptions: ColumnOptions) {
  return OriginalUpdateDateColumn(EnvSpecificDecoratorValue(columnOptions));
}
