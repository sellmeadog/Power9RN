import { P9LogicalOperator, P9Predicate, P9StringOperator } from './predicate';

export function serializeStringPredicate(predicate: P9Predicate<string>) {
  const {
    attribute,
    expression,
    logicalOperator = P9LogicalOperator.And,
    stringOperator = P9StringOperator.BeginsWith,
  } = predicate;

  const expression_ = expression?.trim();

  if (expression_) {
    return [logicalOperator, attribute, stringOperator, `"${expression_}"`].join(' ');
  }

  return undefined;
}

export function serialize(predicate: P9Predicate) {
  switch (predicate.attribute) {
    default:
      return serializeStringPredicate(predicate);
  }
}
