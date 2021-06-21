import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { entitiesToArray, entitiesToMap, HashMap, QueryEntity } from '@datorama/akita';

import { P9ColorPredicateExpression, P9Predicate } from '../model/predicate';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

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
  predicate$: Observable<string> = combineLatest([this.namePredicate$, this.oracleTextPredicate$]).pipe(
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

  canResetAttribute = (attribute: string) =>
    this.selectEntity(attribute, 'predicates').pipe(map(({ length }) => Boolean(length)));

  predicateArray = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as P9Predicate[] | undefined));

  predicateMap = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as HashMap<P9Predicate> | undefined));
}

function serializeStringPredicateArray(predicates: P9Predicate<string>[]): string {
  return predicates
    .filter(({ expression }) => Boolean(expression))
    .map(
      ({ attribute, expression, logicalOperator, stringOperator }) =>
        `${logicalOperator} ${attribute} ${stringOperator} "${expression}"`,
    )
    .join(' ');
}
