import { HashMap, isArray } from '@datorama/akita';

import { P9GameSymbolType } from '../../../components';
import {
  P9AttributePredicate,
  P9ColorPredicateExpression,
  P9ComparisonOperator,
  P9LogicalOperator,
  P9PickerPredicateExpression,
  P9Predicate,
  P9StringOperator,
} from './predicate';

export function serializeColorPredicate({ attribute, predicates }: P9AttributePredicate<P9ColorPredicateExpression>) {
  const { enforceIdentity, fuzziness = 0, selection } = predicates as P9ColorPredicateExpression;
  const attribute_ = enforceIdentity ? 'color_identity' : attribute;
  const colors: P9GameSymbolType[] = ['W', 'U', 'B', 'R', 'G', 'C'];
  const selectionTuples = colors.map((color): [color: P9GameSymbolType, value: boolean] => [
    color,
    Boolean(selection?.[color]),
  ]);
  let predicate = '';

  if (selectionTuples.every(([_, value]) => !value)) {
    return predicate;
  }

  switch (fuzziness) {
    case 0:
      predicate = selectionTuples
        .sort(([_, a], [__, b]) => Number(b) - Number(a))
        .map(([color, value]) => `${value ? 'AND' : 'AND NOT'} ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;

    case 1:
      predicate = selectionTuples
        .filter(([_, value]) => value)
        .map(([color]) => `AND ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;

    case 2:
      const include = selectionTuples
        .filter(([_, value]) => value)
        .map(([color]) => `${attribute_} =[c] "${color}"`)
        .reduceRight(
          (acc, curr) => [curr, ...acc],
          [enforceIdentity ? 'color_identity =[c] "C"' : 'card_faces.colors.@count == 0'],
        )
        .join(' OR ');

      const exclude = selectionTuples
        .filter(([_, value]) => !value)
        .map(([color]) => `NOT ${attribute_} =[c] "${color}"`)
        .join(' AND ');

      predicate = [include, exclude]
        .filter((value) => Boolean(value))
        .join(' AND ')
        .trim();
      break;

    case 3:
      predicate = selectionTuples
        .filter(([_, value]) => value)
        .map(([color]) => `AND NOT ${attribute_} =[c] "${color}"`)
        .join(' ');
      break;
  }

  return predicate ? `(${predicate.replace(/^(AND\s?|OR)\s+/, '')})` : undefined;
}

export function serializePickerPredicate(
  predicate: P9AttributePredicate<P9PickerPredicateExpression>,
  serializeFn = defaultPickerSerializeFn,
) {
  const predicates = Object.values(predicate.predicates as HashMap<P9Predicate<P9PickerPredicateExpression>>);

  const serialization = predicates
    .filter(({ expression }) => expression.selected)
    .sort(byLogicalOperator)
    .map(serializeFn)
    .join(' ')
    .replace(/^(AND\s?|OR)\s+/, '');

  return serialization ? `(${serialization})` : undefined;
}

export function serializeLegalityPredicate(predicate: P9AttributePredicate<P9PickerPredicateExpression>) {
  const predicates = Object.values(predicate.predicates as HashMap<P9Predicate<P9PickerPredicateExpression>>);

  const serialization = predicates
    .filter(({ expression }) => expression.selected)
    .sort(byLogicalOperator)
    .map(legalitySerializeFn)
    .join(' ')
    .replace(/^(AND\s?|OR)\s+/, '');

  return serialization ? `(${serialization})` : undefined;
}

export function serializeStringPredicate({ predicates }: P9AttributePredicate<string>) {
  if (isArray(predicates)) {
    const predicate = predicates
      .filter(({ expression }) => Boolean(expression))
      .sort(byLogicalOperator)
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
}

export function serializeNumericPredicate({ predicates }: P9AttributePredicate<number>) {
  if (isArray(predicates)) {
    const predicate = predicates
      .filter(({ expression }) => Number.isInteger(expression))
      .sort(byLogicalOperator)
      .map(
        (
          {
            attribute,
            comparisonOperator = P9ComparisonOperator.Equal,
            expression,
            logicalOperator = P9LogicalOperator.And,
          },
          index,
        ) =>
          [
            index === 0 ? (logicalOperator === P9LogicalOperator.Not ? 'NOT' : '') : logicalOperator,
            attribute,
            comparisonOperator,
            expression,
          ]
            .join(' ')
            .trim(),
      )
      .join(' ');

    return predicate ? `(${predicate})` : undefined;
  } else {
    throw new Error('serializeNumericPredicate was called for an attribute predicate whose body is not an array.');
  }
}

export function serialize(predicate: P9AttributePredicate) {
  switch (predicate.attribute) {
    case 'card_faces.artist':
    case 'card_faces.types':
      return serializePickerPredicate(predicate);

    case 'legalities':
      return serializeLegalityPredicate(predicate);

    case 'card_faces.colors':
      return serializeColorPredicate(predicate);

    case 'gameplay.stats':
      return serializeNumericPredicate(predicate);

    default:
      return serializeStringPredicate(predicate);
  }
}

const defaultPickerSerializeFn = ({
  attribute,
  expression,
  logicalOperator,
}: P9Predicate<P9PickerPredicateExpression>): string =>
  [logicalOperator, attribute, '=[c]', `"${expression.value}"`].join(' ').trim();

const legalitySerializeFn = ({
  attribute,
  expression,
  logicalOperator,
}: P9Predicate<P9PickerPredicateExpression>): string => {
  if (logicalOperator === P9LogicalOperator.Not) {
    return `${P9LogicalOperator.And} (${attribute} =[c] "${expression.value}:banned")`;
  } else {
    return `${logicalOperator} (${['legal', 'restricted']
      .map((status) => [attribute, '=[c]', `"${expression.value}:${status}"`].join(' ').trim())
      .join(' OR ')})`;
  }
};

const byLogicalOperator = (
  { logicalOperator: a = P9LogicalOperator.And }: P9Predicate,
  { logicalOperator: b = P9LogicalOperator.And }: P9Predicate,
) => {
  const charA = a[a.length - 1];
  const charB = b[b.length - 1];

  return charA > charB ? 1 : charA < charB ? -1 : 0;
};
