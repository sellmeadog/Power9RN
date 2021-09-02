import { produce } from 'immer';
import { PurchaserInfo, PurchasesPackage } from 'react-native-purchases';
import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { Store } from '@datorama/akita';

export interface P9PurchasesState extends SimpleObject {
  purchaser?: PurchaserInfo;
  packages: PurchasesPackage[];
}

@singleton()
export class P9PurchasesStore extends Store<P9PurchasesState> implements Observer<P9PurchasesState> {
  constructor() {
    super({ packages: [] }, { name: 'purchases', producerFn: produce });
  }

  next = (patch: Partial<P9PurchasesState>) => {
    this.update((draft) => {
      Object.entries(patch).forEach(([key, value]) => {
        draft[key] = value;
      });
    });
    this.setLoading(false);
  };

  error = (error: unknown) => {
    this.setError(error);
    this.setLoading(false);
  };

  complete = () => {
    this.setLoading(false);
  };
}
