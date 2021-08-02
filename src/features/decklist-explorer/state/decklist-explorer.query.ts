import { from } from 'rxjs';
import { groupBy, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from './decklist-feature.store';

@singleton()
export class P9DecklistExplorerQuery extends QueryEntity<P9UserDecklistFeatureState> {
  decklistGroups$ = this.selectAll().pipe(
    switchMap((data) =>
      from(data).pipe(
        groupBy(({ formatId = 'casual' }) => formatId),
        mergeMap((group) =>
          group.pipe(
            toArray(),
            map((grouped) => ({ formatId: group.key, data: grouped })),
          ),
        ),
        toArray(),
      ),
    ),
  );

  constructor(store: P9UserDecklistFeatureStore) {
    super(store);
  }
}
