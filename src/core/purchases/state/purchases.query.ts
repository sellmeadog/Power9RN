import { useObservable, useObservableState } from 'observable-hooks';
import { PurchasesEntitlementInfo } from 'react-native-purchases';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

import { Query } from '@datorama/akita';

import { useDependency } from '../../di';
import { P9PurchasesState, P9PurchasesStore } from './purchases.store';

@singleton()
export class P9PurchasesQuery extends Query<P9PurchasesState> {
  activeSubscription$ = this.select(
    ({ purchaser }) => Object.values(purchaser?.entitlements.active ?? {})[0] as PurchasesEntitlementInfo,
  );

  isSubscriptionActive$ = this.activeSubscription$.pipe(map(Boolean));

  availablePackages$ = this.select(({ packages }) => packages);

  constructor(store: P9PurchasesStore) {
    super(store);
  }
}

export function useAvailablePackages() {
  const query = useDependency(P9PurchasesQuery);

  return useObservableState(
    useObservable(() => query.availablePackages$),
    [],
  );
}

export function useActiveSubscription() {
  const query = useDependency(P9PurchasesQuery);
  return useObservableState(useObservable(() => query.activeSubscription$));
}
