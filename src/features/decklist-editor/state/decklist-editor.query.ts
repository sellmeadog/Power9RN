import { combineLatest, Observable } from 'rxjs';
import { singleton } from 'tsyringe';

import { QueryEntity } from '@datorama/akita';

import { P9UserDecklistFeatureState, P9UserDecklistFeatureStore } from '../../decklist-explorer/state';
import { P9DecklistEditorState } from '../decklist-editor.model';

@singleton()
export class P9DecklistEditorQuery extends QueryEntity<P9UserDecklistFeatureState> {
  editorState$: Observable<P9DecklistEditorState> = combineLatest({
    activeEntryType: this.select(({ ui }) => ui.decklistEditorState?.activeEntryType),
    name: this.selectActive(({ name }) => name),
  });

  constructor(store: P9UserDecklistFeatureStore) {
    super(store);
  }
}
