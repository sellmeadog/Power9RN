import { produce } from 'immer';
import { singleton } from 'tsyringe';

import { ActiveState, EntityState, EntityStore, ID } from '@datorama/akita';

import { P9UserDecklist } from '../../../core/data-user';
import { P9CreateDecklistInfo } from '../../decklist-parse';
import { P9DecklistEditorUIState } from './decklist-feature.model';

export interface P9UserDecklistFeatureState extends EntityState<P9UserDecklist, ID>, ActiveState {
  ui: {
    decklistInfo?: P9CreateDecklistInfo;
    decklistEditorState?: P9DecklistEditorUIState;
  };
}

@singleton()
export class P9UserDecklistFeatureStore extends EntityStore<P9UserDecklistFeatureState> {
  constructor() {
    super({ ui: {} }, { idKey: '_id', name: 'user-decklist-feature', producerFn: produce });
  }

  // akitaPreAddEntity = (decklist: P9UserDecklist & Realm.Object) => decklist.toJSON();
}
