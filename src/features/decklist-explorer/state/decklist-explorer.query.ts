import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { P9_GAME_FORMATS } from './decklist-feature.model';
import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from './decklist-feature.store';

@singleton()
export class P9DecklistExplorerQuery extends QueryEntity<P9UserDecklistFeatureState> {
  decklistGroups$ = combineLatest(
    P9_GAME_FORMATS.map(({ id }) => id).map((formatId) =>
      this.selectAll({ filterBy: (entity) => entity.formatId === formatId }).pipe(
        map((data) => ({ formatId, data: data.length ? [data] : [] })),
      ),
    ),
  ).pipe(map((sections) => sections.filter(({ data }) => data.length)));

  constructor(store: P9UserDecklistFeatureStore) {
    super(store);
  }
}
