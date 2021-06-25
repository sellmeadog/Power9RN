import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../core/operators';
import { P9LogicalOperator, P9Predicate, P9PredicateAttributeGroup, P9PredicateExpression } from '../model/predicate';
import { serializeColorPredicate, serializeLegalityPredicate } from '../model/serialization';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

const MAGIC_CARD_FILTER_ATTRIBUTES = [
  'card_faces.artist',
  'card_faces.colors',
  'card_faces.flavor_text',
  'card_faces.loyalty_numeric',
  'card_faces.names',
  'card_faces.oracle_text',
  'card_faces.power_numeric',
  'card_faces.toughness_numeric',
  'card_faces.types',
  'cmc',
  'legalities',
  // 'rarity',
];

@singleton()
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  predicate$: Observable<string> = combineLatest(
    MAGIC_CARD_FILTER_ATTRIBUTES.map((attribute) =>
      this.selectEntity(attribute).pipe(
        whenDefined(),
        map((group) => serialize(group)),
      ),
    ),
  ).pipe(
    map((predicates) =>
      predicates
        .filter(Boolean)
        .map((predicate) => `(${predicate.replace(/^(AND\s?|OR)\s+/, '')})`)
        .join(' AND '),
    ),
  );

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }
}

function serialize(predicateGroup: P9PredicateAttributeGroup) {
  switch (predicateGroup.attribute) {
    case 'card_faces.colors':
      return serializeColorPredicate(predicateGroup);

    case 'legalities':
      return serializeLegalityPredicate(predicateGroup);

    default:
      return defaultPredicateSerializer(predicateGroup);
  }
}

const byLogicalOperator = (
  { logicalOperator: a = P9LogicalOperator.And }: P9Predicate,
  { logicalOperator: b = P9LogicalOperator.And }: P9Predicate,
) => {
  const charA = a[a.length - 1];
  const charB = b[b.length - 1];

  return charA > charB ? 1 : charA < charB ? -1 : 0;
};

function defaultPredicateSerializer<E extends P9PredicateExpression = any>({
  predicates,
}: P9PredicateAttributeGroup<E>) {
  return predicates
    .filter(({ expression }) => (typeof expression === 'string' ? Boolean(expression) : true))
    .sort(byLogicalOperator)
    .map(({ attribute, comparisonOperator, logicalOperator, stringOperator, expression }) =>
      [
        logicalOperator,
        attribute,
        comparisonOperator || stringOperator,
        typeof expression === 'string' ? `"${expression.trim()}"` : expression,
      ].join(' '),
    )
    .join(' ');
}
