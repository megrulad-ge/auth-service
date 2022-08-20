import { EnvSpecificDecoratorValue, resolveDefault, resolveType } from './environment-specific-column.decorator';
import { ColumnOptions, ColumnType } from 'typeorm';
import { NodeEnv } from '../types';

describe.each`
  type            | expected
  ${'timestamp'}  | ${'datetime'}
  ${'mediumblob'} | ${'blob'}
  ${'mediumtext'} | ${'text'}
  ${'jsonb'}      | ${'text'}
  ${'json'}       | ${'text'}
  ${'enum'}       | ${'text'}
  ${'uuid'}       | ${'text'}
  ${'unknown'}    | ${'unknown'}
`('resolveType( $type )', ({ type, expected }) => {
  it(`should return ${expected}`, () => {
    expect(resolveType(type)).toBe(expected);
  });
});

describe.each`
  defaultValue         | expected
  ${true}              | ${true}
  ${false}             | ${false}
  ${undefined}         | ${undefined}
  ${'hello'}           | ${'hello'}
  ${'text'}            | ${'text'}
  ${128}               | ${128}
  ${{ data: 'hello' }} | ${'{"data":"hello"}'}
  ${[1, 2, 3]}         | ${'[1,2,3]'}
`('resolveDefault( $defaultValue )', ({ defaultValue, expected }) => {
  it(`should return ${expected}`, () => {
    expect(resolveDefault(defaultValue)).toBe(expected);
  });
});

describe('EnvSpecificDecoratorValue', () => {
  it('should resolve for TEXT type', () => {
    const columnOptions: ColumnOptions = {
      type: 'text',
      default: 'default-text',
    };

    expect(EnvSpecificDecoratorValue(columnOptions)).toEqual({
      type: 'text',
      default: 'default-text',
    });
  });

  it('should resolve for JSONB type', () => {
    const columnOptions: ColumnOptions = {
      type: 'jsonb',
      default: { data: 'hello' },
    };

    expect(EnvSpecificDecoratorValue(columnOptions)).toEqual({
      type: 'text',
      default: '{"data":"hello"}',
    });
  });
});

describe('non-TEST env', () => {
  const ref = { env: process.env.NODE_ENV };
  beforeEach(() => (process.env.NODE_ENV = NodeEnv.DEVELOPMENT));
  afterEach(() => (process.env.NODE_ENV = ref.env));

  it('should verify resolveType to skip in DEV', function () {
    const columnOptions: ColumnType = 'jsonb';

    expect(resolveType(columnOptions)).toBe('jsonb');
  });

  it('should verify resolveDefault to skip in DEV', function () {
    const columnOptions: ColumnOptions = {
      type: 'jsonb',
      default: { data: 'hello' },
    };

    expect(resolveDefault(columnOptions)).toEqual(columnOptions);
  });
});
