import { produce } from 'immer';
import { PurchaserInfo, PurchasesPackage } from 'react-native-purchases';
import { Observer } from 'rxjs';
import { Lifecycle, scoped } from 'tsyringe';

import { Store } from '@datorama/akita';

export interface P9PurchasesState extends SimpleObject {
  purchaser?: PurchaserInfo;
  packages: PurchasesPackage[];
}

@scoped(Lifecycle.ContainerScoped)
export class P9PurchasesStore extends Store<P9PurchasesState> implements Observer<P9PurchasesState> {
  constructor() {
    super({ packages: [] }, { name: 'purchases', producerFn: produce });
  }

  patch = (patch: Partial<P9PurchasesState>) => {
    this.update((draft) => {
      Object.entries(patch).forEach(([key, value]) => {
        draft[key] = value;
      });
    });
  };

  next = (patch: Partial<P9PurchasesState>) => {
    this.patch(patch);
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
