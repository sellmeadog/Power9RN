import { Alert } from 'react-native';
import Environment from 'react-native-config';
import Purchases, {
  PACKAGE_TYPE,
  PurchaserInfo,
  PurchaserInfoUpdateListener,
  PurchasesPackage,
} from 'react-native-purchases';
import {
  combineLatest,
  defer,
  EMPTY,
  firstValueFrom,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
} from 'rxjs';
import { catchError, first, map, mapTo, mergeMap, mergeMapTo, retry, tap } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';

import { P9AuthorizationQuery } from '../../authorization';
import { P9User } from '../../authorization/authorization.store';
import { P9PurchasesQuery } from './purchases.query';
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

@scoped(Lifecycle.ContainerScoped)
export class P9PurchasesService {
  constructor(
    private store: P9PurchasesStore,
    private query: P9PurchasesQuery,
    private authQuery: P9AuthorizationQuery,
  ) {}

  purchaseSubscription = (subscription: PurchasesPackage) => {
    this.store.setLoading(true);

    defer(() => Purchases.purchasePackage(subscription))
      .pipe(
        retry(3),
        map(({ purchaserInfo }) => ({ purchaser: purchaserInfo })),
        catchError(() => {
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
        catchError(() => {
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

  trialSubscription = async () => {
    return await firstValueFrom(
      this.query.availablePackages$.pipe(
        map((packages) => packages.find(({ packageType }) => packageType === PACKAGE_TYPE.MONTHLY)),
        mergeMap((pkg) =>
          pkg
            ? defer(() => Purchases.purchasePackage(pkg)).pipe(
                retry(3),
                map(({ purchaserInfo }) => ({ purchaser: purchaserInfo })),
                tap(this.store.patch),
                mapTo(true),
                catchError(() => of(false)),
              )
            : of(false),
        ),
      ),
    );
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
    Purchases.setup(Environment.P9_REVENUECAT_API_KEY, id);
  });
}
