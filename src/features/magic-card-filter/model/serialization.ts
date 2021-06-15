import { HashMap, isArray } from '@datorama/akita';

import { P9GameSymbolType } from '../../../components';
import {
  P9AttributePredicate,
  P9ColorPredicateExpression,
  P9LogicalOperator,
  P9PickerPredicateExpression,
  P9Predicate,
  P9StringOperator,
} from './predicate';

export function serializeColorPredicate({ attribute, predicates }: P9AttributePredicate<P9ColorPredicateExpression>) {
  const { enforceIdentity, fuzziness = 0, ...rest } = predicates as P9ColorPredicateExpression;
  const attribute_ = enforceIdentity ? 'color_identity' : attribute;
  const colors: P9GameSymbolType[] = ['W', 'U', 'B', 'R', 'G', 'C'];
  const selection = colors.map((color): [color: P9GameSymbolType, value: boolean] => [color, Boolean(rest[color])]);
  let predicate = '';

  if (selection.every(([_, value]) => !value)) {
    return predicate;
  }

  switch (fuzziness) {
    case 0:
      predicate = selection
        .sort(([_, a], [__, b]) => Number(b) - Number(a))
        .map(([color, value]) => `${value ? 'AND' : 'AND NOT'} ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;

    case 1:
      predicate = selection
        .filter(([_, value]) => value)
        .map(([color]) => `AND ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;

    case 2:
      const include = selection
        .filter(([_, value]) => value)
        .map(([color]) => `${attribute_} =[c] "${color}"`)
        .reduceRight(
          (acc, curr) => [curr, ...acc],
          [enforceIdentity ? 'color_identity =[c] "C"' : 'card_faces.colors.@count == 0'],
        )
        .join(' OR ');

      const exclude = selection
        .filter(([_, value]) => !value)
        .map(([color]) => `NOT ${attribute_} =[c] "${color}"`)
        .join(' AND ');

      predicate = [include, exclude]
        .filter((value) => Boolean(value))
        .join(' AND ')
        .trim();
      break;

    case 3:
      predicate = selection
        .filter(([_, value]) => value)
        .map(([color]) => `AND NOT ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;
  }

  return predicate ? `(${predicate.replace(/^(AND\s?|OR)\s+/, '')})` : undefined;
}

export function serializePickerPredicate(predicate: P9AttributePredicate<P9PickerPredicateExpression>) {
  const predicates = Object.values(predicate.predicates as HashMap<P9Predicate<P9PickerPredicateExpression>>);

  const serialization = predicates
    .filter(({ expression }) => expression.selected)
    .map(({ attribute, expression, logicalOperator }) =>
      [logicalOperator, attribute, '=[c]', `"${expression.value}"`].join(' ').trim(),
    )
    .join(' ')
    .replace(/^(AND\s?|OR)\s+/, '');

  return serialization ? `(${serialization})` : undefined;
}

export function serializeStringPredicate({ predicates }: P9AttributePredicate<string>) {
  if (isArray(predicates)) {
    const predicate = predicates
      .filter(({ expression }) => Boolean(expression))
      .sort(({ logicalOperator: a = P9LogicalOperator.And }, { logicalOperator: b = P9LogicalOperator.And }) => {
        const charA = a[a.length - 1];
        const charB = b[b.length - 1];
        return charA > charB ? 1 : charA < charB ? -1 : 0;
      })
      .map(
        (
          {
            attribute,
            expression,
            logicalOperator = P9LogicalOperator.And,
            stringOperator = P9StringOperator.BeginsWith,
          },
          index,
        ) =>
          [
            index === 0 ? (logicalOperator === P9LogicalOperator.Not ? 'NOT' : '') : logicalOperator,
            attribute,
            stringOperator,
            `"${expression.trim()}"`,
          ]
            .join(' ')
            .trim(),
      )
      .join(' ');

    return predicate ? `(${predicate})` : undefined;
  } else {
    throw new Error('serializeStringPredicate was called for an attribute predicate whose body is not an array.');
  }
  // const {
  //   attribute,
  //   expression,
  //   logicalOperator = P9LogicalOperator.And,
  //   stringOperator = P9StringOperator.BeginsWith,
  // } = predicate;

  // const expression_ = expression?.trim();

  // if (expression_) {
  //   if (logicalOperator === P9LogicalOperator.Not) {
  //     return `AND (NOT ${attribute} ${stringOperator} "${expression}")`;
  //   }

  //   return `${logicalOperator} ${attribute} ${stringOperator} "${expression}"`;
  // }

  // return undefined;
}

export function serialize(predicate: P9AttributePredicate) {
  switch (predicate.attribute) {
    case 'card_faces.artist':
      return serializePickerPredicate(predicate);

    case 'card_faces.colors':
      return serializeColorPredicate(predicate);

    default:
      return serializeStringPredicate(predicate);
  }
}
