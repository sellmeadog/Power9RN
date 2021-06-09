import { P9GameSymbolType } from '../../../components';

export enum P9ComparisonOperator {
  Equal = '==',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
}

export enum P9LogicalOperator {
  And = 'AND',
  Or = 'OR',
  Not = 'AND NOT',
}

export enum P9StringOperator {
  BeginsWith = 'BEGINSWITH[c]',
  Contains = 'CONTAINS[c]',
  EndsWith = 'ENDSWITH[c]',
  Like = 'LIKE[c]',
}

export interface P9Predicate<E = any> {
  attribute: string;
  comparisonOperator?: P9ComparisonOperator;
  expression: E;
  id: string;
  logicalOperator?: P9LogicalOperator;
  stringOperator?: P9StringOperator;
}

export type P9ColorPredicateExpression<K extends P9GameSymbolType = P9GameSymbolType> = {
  [key in K]?: boolean;
} & { enforceIdentity?: boolean; fuzziness?: number };
