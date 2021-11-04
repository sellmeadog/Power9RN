import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { Order, QueryEntity } from '@datorama/akita';

import { P9_GAME_FORMATS } from './decklist-feature.model';
import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from './decklist-feature.store';

@scoped(Lifecycle.ContainerScoped)
export class P9DecklistExplorerQuery extends QueryEntity<P9UserDecklistFeatureState> {
  decklists$ = this.selectAll({ sortBy: 'modifiedOn', sortByOrder: Order.DESC });

  decklistCount$ = this.selectCount();

  decklistGroups$ = combineLatest(
    P9_GAME_FORMATS.map(({ id }) => id).map((formatId) =>
      this.selectAll({
        filterBy: (entity) => entity.formatId === formatId,
        sortBy: 'modifiedOn',
        sortByOrder: Order.DESC,
      }).pipe(map((data) => ({ formatId, data: data.length ? [data] : [], title: `${formatId} Decks` }))),
    ),
  ).pipe(map((sections) => sections.filter(({ data }) => data.length)));

  activeDecklistSection$ = this.select(({ ui }) => ui.activeDecklistSection);

  activeDecklistSectionData$ = combineLatest([this.decklists$, this.activeDecklistSection$]).pipe(
    map(([decklists, activeType]) => decklists.filter(({ formatId = 'casual' }) => formatId === activeType)),
  );

  constructor(store: P9UserDecklistFeatureStore) {
    super(store);
  }
}
