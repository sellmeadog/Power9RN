import { Observable } from 'rxjs';

import { QueryEntity } from '@datorama/akita';

import { P9MagicCardFilterState, P9MagicCardFilterStore, P9Predicate } from './magic-card-filter.store';

export class P9MagicCardFilterQuery extends QueryEntity<P9MagicCardFilterState> {
  constructor(store: P9MagicCardFilterStore) {
    super(store);
  }

  forAttribute = (attribute: string): Observable<P9Predicate[] | undefined> =>
    this.selectAll({
      filterBy: ({ attribute: attirbute_ }) => attirbute_ === attribute,
    });
}
