import { EnvSpecificDecoratorValue } from './environment-specific-column.decorator';
import { ColumnOptions, Column as OriginalColumn } from 'typeorm';

export function Column(columnOptions: ColumnOptions) {
  return OriginalColumn(EnvSpecificDecoratorValue(columnOptions));
}
