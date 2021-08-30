import { produce } from 'immer';
import { PurchaserInfo } from 'react-native-purchases';
import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { Store } from '@datorama/akita';

export interface P9PurchasesState extends SimpleObject {
  purchaser?: PurchaserInfo;
}

@singleton()
export class P9PurchasesStore extends Store<P9PurchasesState> implements Observer<P9PurchasesState> {
  constructor() {
    super({}, { name: 'purchases', producerFn: produce });
  }

  next = (patch: Partial<P9PurchasesState>) => {
    this.update((draft) => {
      Object.entries(patch).forEach(([key, value]) => {
        draft[key] = value;
      });
    });
  };

  error = (error: unknown) => {
    this.setError(error);
  };

  complete = () => {
    // NOOP
  };
}
