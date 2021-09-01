import { useCallback, useEffect } from 'react';
import Environment from 'react-native-config';
import Purchases, { PurchaserInfo, PurchaserInfoUpdateListener, PurchasesPackage } from 'react-native-purchases';
import { combineLatest, defer, EMPTY, merge, Observable, of } from 'rxjs';
import { catchError, first, map, mergeMapTo, retry, tap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { P9AuthorizationQuery } from '../../authorization';
import { useDependency } from '../../di';
import { P9PurchasesStore } from './purchases.store';

@singleton()
export class P9PurchasesService {
  constructor(private store: P9PurchasesStore, private authQuery: P9AuthorizationQuery) {}

  purchase = (subscription: PurchasesPackage) => {
    defer(() => Purchases.purchasePackage(subscription))
      .pipe(map(({ purchaserInfo }) => ({ purchaser: purchaserInfo })))
      .subscribe(this.store);
  };

  setup = () => {
    const purchaserInfo$ = defer(() => Purchases.getPurchaserInfo()).pipe(
      retry(3),
      catchError(() => EMPTY),
    );

    const purchaserUpdates$ = new Observable<PurchaserInfo>((subscriber) => {
      const listener: PurchaserInfoUpdateListener = subscriber.next.bind(subscriber);
      Purchases.addPurchaserInfoUpdateListener(listener);

      return () => {
        Purchases.removePurchaserInfoUpdateListener(listener);
      };
    });

    const packages$ = defer(() => Purchases.getOfferings()).pipe(
      retry(3),
      map((offerings) => offerings.current?.availablePackages ?? ([] as PurchasesPackage[])),
      catchError(() => of([] as PurchasesPackage[])),
    );

    const subscription = this.authQuery.authorizedUser$
      .pipe(
        first(),
        tap(({ id }) => {
          console.log(`Setup RevenueCat SDK for user ${id}...`);
          Purchases.setup(Environment.P9_REVENUECAT_API_KEY, id);
          console.log('RevenueCat SDK setup!');
        }),
        mergeMapTo(
          combineLatest({
            purchaser: merge(purchaserInfo$, purchaserUpdates$),
            packages: packages$,
          }),
        ),
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

export function usePurchaseSubscription() {
  const service = useDependency(P9PurchasesService);
  return useCallback((subscription: PurchasesPackage) => service.purchase(subscription), [service]);
}
