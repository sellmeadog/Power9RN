import { combineLatest } from 'rxjs';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { useDependency } from '../../../core/di';
import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from './decklist-feature.store';

@singleton()
export class P9UserDecklistFeatureQuery extends QueryEntity<P9UserDecklistFeatureState> {
  decklists$ = this.selectAll({ sortBy: (entity) => entity.modifiedOn });
  homeScreenState$ = combineLatest({ data: this.decklists$ });
  createDecklistUIState$ = this.select(({ ui }) => ui.decklistInfo);

  constructor(store: P9UserDecklistFeatureStore) {
    super(store);
  }
}

export function useUserDecklistFeatureQuery() {
  return useDependency(P9UserDecklistFeatureQuery);
}
