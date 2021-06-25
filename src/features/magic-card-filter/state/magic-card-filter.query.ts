import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../core/operators';
import { P9LogicalOperator, P9Predicate, P9PredicateAttributeGroup, P9PredicateExpression } from '../model/predicate';
import { serializeColorPredicate } from '../model/serialization';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

const MAGIC_CARD_FILTER_ATTRIBUTES = [
  'card_faces.artist',
  'card_faces.colors',
  'card_faces.flavor_text',
  // 'card_faces.loyalty',
  'card_faces.names',
  'card_faces.oracle_text',
  // 'card_faces.power',
  // 'card_faces.toughness',
  'card_faces.types',
  // 'cmc',
  'legalities',
  // 'rarity',
];

@singleton()
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  // namePredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.names', 'predicates');
  // namePredicate$: Observable<string> = this.namePredicates$.pipe(map(serializeStringPredicateArray));

  // oracleTextPredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.oracle_text', 'predicates');
  // oracleTextPredicate$: Observable<string> = this.oracleTextPredicates$.pipe(map(serializeStringPredicateArray));

  // typeLinePredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.type_line', 'predicates').pipe(
  //   map((entities: HashMap<P9Predicate<string>>): P9Predicate<string>[] => entitiesToArray(entities, {})),
  // );

  // colorPredicate$: Observable<P9ColorPredicateExpression | undefined> = this.selectEntity('card_faces.colors').pipe(
  //   map((predicate) => predicate?.predicates as P9ColorPredicateExpression),
  // );

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

  // attributePredicates = <E>(attribute: string): Observable<P9Predicate<E>[]> =>
  //   this.selectEntity(attribute, 'predicates');

  // attributeSelection = (attribute: string): Observable<HashMap<boolean>> =>
  //   this.selectEntity(attribute, 'predicates').pipe(toSelection());

  // canResetAttribute = (attribute: string) =>
  //   this.selectEntity(attribute, 'predicates').pipe(map(({ length }) => Boolean(length)));

  // predicateArray = (attribute: string) =>
  //   this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as P9Predicate[] | undefined));

  // predicateMap = (attribute: string) =>
  //   this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as HashMap<P9Predicate> | undefined));
}

// function toSelection<E extends string>(): OperatorFunction<P9Predicate<E>[], HashMap<boolean>> {
//   return map((predicates) =>
//     Object.entries(predicates).reduce(
//       (selection, [_, { expression }]) => ({ ...selection, [expression]: true }),
//       {} as HashMap<boolean>,
//     ),
//   );
// }

// function serializeStringPredicateArray(predicates: P9Predicate<string>[]): string {
//   return predicates
//     .filter(({ expression }) => Boolean(expression))
//     .map(
//       ({
//         attribute,
//         expression,
//         logicalOperator = P9LogicalOperator.And,
//         stringOperator = P9StringOperator.BeginsWith,
//       }) => `${logicalOperator} ${attribute} ${stringOperator} "${expression}"`,
//     )
//     .join(' ');
// }

function serialize(predicateGroup: P9PredicateAttributeGroup) {
  switch (predicateGroup.attribute) {
    case 'card_faces.colors':
      return serializeColorPredicate(predicateGroup);

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
