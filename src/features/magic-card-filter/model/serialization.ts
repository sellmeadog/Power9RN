import { P9GameSymbolType } from '../../../components';
import { P9ColorPredicateExpression, P9LogicalOperator, P9Predicate, P9StringOperator } from './predicate';

export function serializeColorPredicate({
  attribute,
  expression: { fuzziness, ...rest },
}: P9Predicate<P9ColorPredicateExpression>) {
  const colors: P9GameSymbolType[] = ['W', 'U', 'B', 'R', 'G', 'C'];
  const selection = colors.map((color): [color: P9GameSymbolType, value: boolean] => [color, Boolean(rest[color])]);

  if (selection.every(([_, value]) => !value)) {
    return '';
  }

  switch (fuzziness) {
    case 0:
      return selection
        .sort(([_, a], [__, b]) => Number(b) - Number(a))
        .map(([color, value]) => `${value ? 'AND' : 'AND NOT'} ${attribute} =[c] "${color}"`)
        .join(' ');

    case 1:
      return selection
        .filter(([_, value]) => value)
        .map(([color]) => `AND ${attribute} =[c] "${color}"`)
        .join(' ');

    case 2:
      const include = selection
        .filter(([_, value]) => value)
        .map(([color]) => `${attribute} =[c] "${color}"`)
        .reduceRight((acc, curr) => [curr, ...acc], ['card_faces.colors.@count == 0'])
        .join(' OR ');

      const exclude = selection
        .filter(([_, value]) => !value)
        .map(([color]) => `NOT ${attribute} =[c] "${color}"`)
        .join(' AND ');

      return ['', include, exclude]
        .filter((value, index) => (index === 0 ? true : Boolean(value)))
        .map((predicate, index) => (index === 0 ? '' : `(${predicate})`))
        .join(' AND ')
        .trim();

    default:
      return '';
  }
}

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
    case 'card_faces.colors':
      return serializeColorPredicate(predicate);

    default:
      return serializeStringPredicate(predicate);
  }
}
