import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { combineQueries, QueryEntity } from '@datorama/akita';

import { whenDefined } from '../../../core/operators';
import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9MagicCardGalleryQuery } from '../../magic-cards/state/magic-card.query';
import { P9DecklistEditorState } from '../decklist-editor.model';

@singleton()
export class P9DecklistEditorQuery extends QueryEntity<P9UserDecklistFeatureState> {
  activeEditorEntry$ = this.select(({ ui }) => ui.decklistEditorState?.activeEntryId).pipe(
    whenDefined(),
    switchMap((activeId) => this.selectActive(({ entries }) => entries.find(({ id }) => id === activeId))),
  );

  readonly entries$ = this.selectActive(({ entries }) => entries);

  editorState$: Observable<P9DecklistEditorState> = combineLatest({
    activeEntryType: this.select(({ ui }) => ui.decklistEditorState?.activeEntryType),
    entries: this.entries$,
    name: this.selectActive(({ name }) => name),
  });

  entryInspectorState$ = combineQueries([
    this.entries$,
    this.select(({ ui }) => ui.decklistEditorState?.activeEntryId).pipe(
      switchMap((activeId) => this.entries$.pipe(map((entries) => entries?.find(({ id }) => id === activeId)))),
    ),
  ]).pipe(map(([entries, activeEntry]) => ({ entries, activeEntry })));

  constructor(store: P9UserDecklistFeatureStore, private magicCardQuery: P9MagicCardGalleryQuery) {
    super(store);
  }
}
