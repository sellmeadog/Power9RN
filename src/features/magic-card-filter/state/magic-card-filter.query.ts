import { combineLatest, Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { entitiesToArray, HashMap, QueryEntity } from '@datorama/akita';

import { P9ColorPredicateExpression, P9LogicalOperator, P9Predicate, P9StringOperator } from '../model/predicate';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

const MAGIC_CARD_FILTER_ATTRIBUTES = [
  'card_faces.artist',
  // 'card_faces.colors',
  'card_faces.flavor_text',
  // 'card_faces.loyalty',
  'card_faces.names',
  'card_faces.oracle_text',
  // 'card_faces.power',
  // 'card_faces.toughness',
  'card_faces.types',
  // 'cmc',
  // 'legalities',
  // 'rarity',
];

@singleton()
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  namePredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.names', 'predicates');
  namePredicate$: Observable<string> = this.namePredicates$.pipe(map(serializeStringPredicateArray));

  oracleTextPredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.oracle_text', 'predicates');
  oracleTextPredicate$: Observable<string> = this.oracleTextPredicates$.pipe(map(serializeStringPredicateArray));

  typeLinePredicates$: Observable<P9Predicate<string>[]> = this.selectEntity('card_faces.type_line', 'predicates').pipe(
    map((entities: HashMap<P9Predicate<string>>): P9Predicate<string>[] => entitiesToArray(entities, {})),
  );

  colorPredicate$: Observable<P9ColorPredicateExpression | undefined> = this.selectEntity('card_faces.colors').pipe(
    map((predicate) => predicate?.predicates as P9ColorPredicateExpression),
  );

  // predicate$ = this.selectAll().pipe(map((predicates) => predicates.map(serialize).filter(Boolean).join(' AND ')));
  predicate$: Observable<string> = combineLatest(
    MAGIC_CARD_FILTER_ATTRIBUTES.map((attribute) =>
      this.selectEntity(attribute, 'predicates').pipe(map(serializeStringPredicateArray)),
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

  attributePredicates = <E>(attribute: string): Observable<P9Predicate<E>[]> =>
    this.selectEntity(attribute, 'predicates');

  attributeSelection = (attribute: string): Observable<HashMap<boolean>> =>
    this.selectEntity(attribute, 'predicates').pipe(toSelection());

  canResetAttribute = (attribute: string) =>
    this.selectEntity(attribute, 'predicates').pipe(map(({ length }) => Boolean(length)));

  predicateArray = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as P9Predicate[] | undefined));

  predicateMap = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as HashMap<P9Predicate> | undefined));
}

function toSelection<E extends string>(): OperatorFunction<P9Predicate<E>[], HashMap<boolean>> {
  return map((predicates) =>
    Object.entries(predicates).reduce(
      (selection, [_, { expression }]) => ({ ...selection, [expression]: true }),
      {} as HashMap<boolean>,
    ),
  );
}

function serializeStringPredicateArray(predicates: P9Predicate<string>[]): string {
  return predicates
    .filter(({ expression }) => Boolean(expression))
    .map(
      ({
        attribute,
        expression,
        logicalOperator = P9LogicalOperator.And,
        stringOperator = P9StringOperator.BeginsWith,
      }) => `${logicalOperator} ${attribute} ${stringOperator} "${expression}"`,
    )
    .join(' ');
}

// function serializationStrategy({ attribute, predicates }: { attribute: string; predicates: P9Predicate[] }) {}
