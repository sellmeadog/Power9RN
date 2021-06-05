import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryEntity } from '@datorama/akita';

import { P9MagicCardFilterState, P9MagicCardFilterStore, P9Predicate } from './magic-card-filter.store';

export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  predicate$ = this.selectAll().pipe(
    map((predicates) =>
      predicates
        .filter(({ expression }) => Boolean(expression))
        .map(({ attribute, expression }) => [attribute, 'BEGINSWITH[c]', `"${expression.trim()}"`].join(' '))
        .join(' AND '),
    ),
  );

  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }

  forAttribute = (attribute: string): Observable<P9Predicate[] | undefined> =>
    this.selectAll({
      filterBy: ({ attribute: attirbute_ }) => attirbute_ === attribute,
    });
}
