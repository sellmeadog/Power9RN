import { HashMap, ID } from '@datorama/akita';

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
  Equals = '=[c]',
  Like = 'LIKE[c]',
}

export interface P9AttributePredicate<E = any> {
  attribute: string;
  predicates: HashMap<P9Predicate<E>> | P9Predicate<E>[] | E;
  [key: string]: any;
}

export interface P9PredicateAttributeGroup<E extends number | string = any> {
  attribute: string;
  predicates: P9Predicate<E>[];
  [key: string]: any;
}

export interface P9Predicate<E = any> {
  attribute: string;
  comparisonOperator?: P9ComparisonOperator;
  expression: E;
  id: ID;
  logicalOperator?: P9LogicalOperator;
  stringOperator?: P9StringOperator;
  [key: string]: any;
}

export type P9SymbolPredicateExpression<K extends P9GameSymbolType = P9GameSymbolType> = {
  [key in K]?: boolean;
};

export type P9ColorPredicateExpression = {
  selection: P9SymbolPredicateExpression;
  enforceIdentity?: boolean;
  fuzziness?: number;
};

export type P9PickerPredicateExpression = { value: string; selected: boolean };
