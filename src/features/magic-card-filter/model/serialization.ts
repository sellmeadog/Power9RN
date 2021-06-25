import { P9GameSymbolType } from '../../../components';
import { P9LogicalOperator, P9Predicate, P9PredicateAttributeGroup } from './predicate';

export function serializeColorPredicate({
  attribute,
  metadata: { enforceIdentity = false, fuzziness = 0 } = {},
  predicates,
}: P9PredicateAttributeGroup<P9GameSymbolType, { enforceIdentity?: boolean; fuzziness?: number }>) {
  const attribute_ = enforceIdentity ? 'color_identity' : attribute;
  const colorSymbols: P9GameSymbolType[] = ['W', 'U', 'B', 'R', 'G', 'C'];
  const selectedSymbols: P9GameSymbolType[] = predicates.map(({ expression }) => expression);

  const selectionTuples = colorSymbols.map((color): [color: P9GameSymbolType, value: boolean] => [
    color,
    selectedSymbols.includes(color),
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

  return predicate ? `(${predicate.replace(/^(AND\s?|OR)\s+/, '')})` : '';
}

export function serializeLegalityPredicate({ predicates }: P9PredicateAttributeGroup<string>) {
  const serialization = predicates
    .filter(({ expression }) => Boolean(expression))
    .sort(byLogicalOperator)
    .map(legalitySerializeFn)
    .join(' ')
    .replace(/^(AND\s?|OR)\s+/, '');

  return serialization ? `(${serialization})` : '';
}

const legalitySerializeFn = ({ attribute, expression, logicalOperator }: P9Predicate<string>): string => {
  if (logicalOperator === P9LogicalOperator.Not) {
    return `${P9LogicalOperator.And} (${attribute} =[c] "${expression}:banned")`;
  } else {
    return `${logicalOperator} (${['legal', 'restricted']
      .map((status) => [attribute, '=[c]', `"${expression}:${status}"`].join(' ').trim())
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
