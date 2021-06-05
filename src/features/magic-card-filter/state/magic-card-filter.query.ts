import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryEntity } from '@datorama/akita';

import { P9Predicate } from '../model/predicate';
import { serialize } from '../model/serialization';
import { P9MagicCardFilterState, P9MagicCardFilterStore } from './magic-card-filter.store';

export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  predicate$ = this.selectAll().pipe(
    map((predicates) =>
      predicates
        .filter(({ expression }) => Boolean(expression))
        .map(serialize)
        .join(' '),
    ),
    map((predicate) => predicate.replace(/^(AND\s?|OR)\s+/, '')),
  );

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }

  forAttribute = (attribute: string): Observable<P9Predicate[] | undefined> =>
    this.selectAll({
      filterBy: ({ attribute: attirbute_ }) => attirbute_ === attribute,
    });
}
