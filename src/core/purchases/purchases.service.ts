import { useEffect } from 'react';
import Environment from 'react-native-config';
import Purchases, { PurchaserInfo, PurchaserInfoUpdateListener } from 'react-native-purchases';
import { defer, merge, Observable } from 'rxjs';
import { first, map, mergeMapTo, retry, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';

import { P9AuthorizationQuery } from '../authorization';
import { useDependency } from '../di';
import { P9PurchasesStore } from './purchases.store';

@injectable()
export class P9PurchasesService {
  constructor(private store: P9PurchasesStore, private authQuery: P9AuthorizationQuery) {}

  setup = () => {
    const purchaserInfo$ = defer(() => Purchases.getPurchaserInfo()).pipe(retry(3));

    const purchaserUpdates$ = new Observable<PurchaserInfo>((subscriber) => {
      const listener: PurchaserInfoUpdateListener = subscriber.next.bind(subscriber);
      Purchases.addPurchaserInfoUpdateListener(listener);

      return () => {
        Purchases.removePurchaserInfoUpdateListener(listener);
      };
    });

    const subscription = this.authQuery.authorizedUser$
      .pipe(
        first(),
        tap(({ id }) => {
          console.log(`Setup RevenueCat SDK for user ${id}...`);
          Purchases.setup(Environment.P9_REVENUECAT_API_KEY, id);
          console.log('RevenueCat SDK setup!');
        }),
        mergeMapTo(merge(purchaserInfo$, purchaserUpdates$)),
        map((purchaser) => ({ purchaser })),
      )
      .subscribe(this.store);

    return subscription.unsubscribe.bind(subscription);
  };
}

export function usePurchasesSetup() {
  const service = useDependency(P9PurchasesService);

  useEffect(() => {
    return service.setup();
  }, [service]);
}
