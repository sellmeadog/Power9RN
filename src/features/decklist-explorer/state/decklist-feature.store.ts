import { produce } from 'immer';
import { singleton } from 'tsyringe';

import { EntityState, EntityStore } from '@datorama/akita';

import { P9UserDecklist } from '../../../core/data-user';
import { P9CreateDecklistInfo } from '../../decklist-parse';

export interface P9UserDecklistFeatureState extends EntityState<P9UserDecklist> {
  ui: {
    decklistInfo?: P9CreateDecklistInfo;
  };
}

@singleton()
export class P9UserDecklistFeatureStore extends EntityStore<P9UserDecklistFeatureState> {
  constructor() {
    super({ ui: {} }, { idKey: '_id', name: 'user-decklist-feature', producerFn: produce });
  }
}
