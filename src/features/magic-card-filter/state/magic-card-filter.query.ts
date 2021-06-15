import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { HashMap, QueryEntity } from '@datorama/akita';

import { P9ColorPredicateExpression, P9Predicate } from '../model/predicate';
import { serialize } from '../model/serialization';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

@singleton()
export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  colorPredicate$: Observable<P9ColorPredicateExpression | undefined> = this.selectEntity('card_faces.colors').pipe(
    map((predicate) => predicate?.predicates as P9ColorPredicateExpression),
  );

  predicate$ = this.selectAll().pipe(map((predicates) => predicates.map(serialize).filter(Boolean).join(' AND ')));

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }

  predicateArray = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as P9Predicate[] | undefined));

  predicateMap = (attribute: string) =>
    this.selectEntity(attribute).pipe(map((entity) => entity?.predicates as HashMap<P9Predicate> | undefined));
}
