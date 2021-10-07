import Realm, { Results } from 'realm';
import { Observer } from 'rxjs';
import { Lifecycle, scoped } from 'tsyringe';

import { Store } from '@datorama/akita';

import { P9UserDecklist } from '../schema/user-decklist';

export interface P9UserDataPartitionState {
  partition?: Realm;
  decklists?: Results<P9UserDecklist>;
}

@scoped(Lifecycle.ContainerScoped)
export class P9UserDataPartitionStore
  extends Store<P9UserDataPartitionState>
  implements Observer<Partial<P9UserDataPartitionState>>
{
  constructor() {
    super({}, { name: 'user-data' });
  }

  next = (value: Partial<P9UserDataPartitionState>): void => {
    this.update((state) => ({ ...state, ...value }));
  };

  error = (error: unknown): void => {
    this.setError(error);
  };

  complete = (): void => {
    this.setLoading(false);
  };
}
