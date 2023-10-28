import { ColumnOptions, ColumnType } from 'typeorm';
import { Env } from '../env';

/**
 * Replace column type to SQLite compatible type for env:TEST or return original implementation
 */
export function resolveType(type: ColumnType): ColumnType {
  if (!Env.isTest) return type;

  switch (true) {
    case type === 'timestamp':
      return 'datetime';
    case type === 'mediumblob':
      return 'blob';
    case type === 'mediumtext':
    case type === 'jsonb':
    case type === 'json':
    case type === 'enum':
    case type === 'uuid':
      return 'text';
    default:
      return type;
  }
}

/**
 * Replace column default value to SQLite compatible value for env:TEST or return original implementation
 */
export function resolveDefault(defaultValue: unknown): any {
  if (!Env.isTest) return defaultValue;

  const whitelist = ['string', 'number', 'boolean', 'text'];
  const type = typeof defaultValue;
  if (!whitelist.includes(type)) return JSON.stringify(defaultValue);

  return defaultValue;
}

/**
 * Environment specific column decorator.
 *
 * Exactly the same as original TypeORM @Column decorator, but
 * this once replaces the column type according when env is TEST.
 * Since for unit tests SQLite is used, it is not possible to use the timestamp, jsonb, ... types.
 * So, this approach is like a mock for the unknown types.
 */
export function EnvSpecificDecoratorValue(columnOptions: ColumnOptions) {
  if (columnOptions.type) columnOptions.type = resolveType(columnOptions.type);
  if (columnOptions.default) columnOptions.default = resolveDefault(columnOptions.default);

  return columnOptions;
}
