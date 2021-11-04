import { produce } from 'immer';
import { Lifecycle, scoped } from 'tsyringe';

import { ActiveState, EntityState, EntityStore, ID } from '@datorama/akita';

import { P9UserDecklist } from '../../../core/data-user';
import { P9CreateDecklistInfo } from '../../decklist-parse';
import { P9DecklistEditorUIState, P9GameFormatType } from './decklist-feature.model';

export interface P9UserDecklistFeatureState extends EntityState<P9UserDecklist, ID>, ActiveState {
  ui: {
    decklistInfo?: P9CreateDecklistInfo;
    decklistEditorState?: P9DecklistEditorUIState;
    activeDecklistSection?: P9GameFormatType;
  };
}

@scoped(Lifecycle.ContainerScoped)
export class P9UserDecklistFeatureStore extends EntityStore<P9UserDecklistFeatureState> {
  constructor() {
    super({ ui: {} }, { idKey: '_id', name: 'user-decklist-feature', producerFn: produce });
  }

  // akitaPreAddEntity = (decklist: P9UserDecklist & Realm.Object) => decklist.toJSON();
}
