import Realm, { Results } from 'realm';
import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { Store } from '@datorama/akita';

export interface P9UserDataPartitionState {
  partition?: Realm;
  decklists?: Results<{}>;
}

@singleton()
export class P9UserPartitionStore
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
