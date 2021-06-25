import { HashMap, ID } from '@datorama/akita';

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

export type P9PredicateExpression = number | string;

export interface P9PredicateAttributeGroup<E extends P9PredicateExpression = any, S = any> {
  attribute: string;
  predicates: P9Predicate<E>[];
  metadata?: S;
}

export interface P9PredicateAttributeGroupState<E extends P9PredicateExpression = any, S = any>
  extends P9PredicateAttributeGroup<E, S> {
  canReset: boolean;
  selection: HashMap<boolean>;
}

export interface P9Predicate<E extends P9PredicateExpression = any> {
  attribute: string;
  comparisonOperator?: P9ComparisonOperator;
  expression: E;
  id: ID;
  logicalOperator?: P9LogicalOperator;
  stringOperator?: P9StringOperator;
}
