import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import Environment from 'react-native-config';
import Purchases, { PurchaserInfo, PurchaserInfoUpdateListener, PurchasesPackage } from 'react-native-purchases';
import { combineLatest, defer, EMPTY, merge, MonoTypeOperatorFunction, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, first, map, mergeMapTo, retry, tap } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { P9AuthorizationQuery } from '../../authorization';
import { P9User } from '../../authorization/authorization.store';
import { useDependency } from '../../di';
import { P9PurchasesState, P9PurchasesStore } from './purchases.store';

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

@singleton()
export class P9PurchasesService {
  constructor(private store: P9PurchasesStore, private authQuery: P9AuthorizationQuery) {}

  purchaseSubscription = (subscription: PurchasesPackage) => {
    this.store.setLoading(true);

    defer(() => Purchases.purchasePackage(subscription))
      .pipe(
        retry(3),
        map(({ purchaserInfo }) => ({ purchaser: purchaserInfo })),
        catchError((reason) => {
          console.log(reason);
          return EMPTY;
        }),
      )
      .subscribe(this.store);
  };

  restoreSubscription = () => {
    this.store.setLoading(true);

    defer(() => Purchases.restoreTransactions())
      .pipe(
        retry(3),
        alertRestoreStatus(),
        map((purchaser) => ({ purchaser })),
        catchError((reason) => {
          console.log(reason);
          return EMPTY;
        }),
      )
      .subscribe(this.store);
  };

  setup = () => {
    const subscription = this.authQuery.authorizedUser$
      .pipe(first(), setupPurchases(), publishState())
      .subscribe(this.store);

    return subscription.unsubscribe.bind(subscription);
  };
}

function alertRestoreStatus(): MonoTypeOperatorFunction<PurchaserInfo> {
  return tap((purchaser) => {
    if (Object.keys(purchaser.entitlements.active).length) {
      Alert.alert('Restore Complete', 'Your subscription has been restored!');
    } else {
      Alert.alert('No Subscription', 'An active Power 9+ subscription was found to restore for your Apple ID.');
    }
  });
}

function publishState(): OperatorFunction<P9User, P9PurchasesState> {
  return mergeMapTo(
    combineLatest({
      purchaser: merge(purchaserInfo$, purchaserUpdates$),
      packages: packages$,
    }),
  );
}

function setupPurchases(): MonoTypeOperatorFunction<P9User> {
  return tap(({ id }) => {
    console.log(`Setup RevenueCat SDK for user ${id}...`);
    Purchases.setup(Environment.P9_REVENUECAT_API_KEY, id);
    console.log('RevenueCat SDK setup!');
  });
}

export function usePurchasesSetup(): void {
  const service = useDependency(P9PurchasesService);

  useEffect(() => {
    return service.setup();
  }, [service]);
}

export type P9PurchaseSubscriptionFn = (subscription: PurchasesPackage) => void;

export function usePurchaseSubscription(): P9PurchaseSubscriptionFn {
  const service = useDependency(P9PurchasesService);
  return useCallback((subscription: PurchasesPackage) => service.purchaseSubscription(subscription), [service]);
}

export type P9RestoreSubscriptionFn = () => void;

export function useRestoreSubscription(): P9RestoreSubscriptionFn {
  const service = useDependency(P9PurchasesService);
  return useCallback(() => service.restoreSubscription(), [service]);
}
