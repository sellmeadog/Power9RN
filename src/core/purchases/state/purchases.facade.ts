import { useObservable, useObservableState } from 'observable-hooks';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { PurchasesEntitlementInfo, PurchasesPackage } from 'react-native-purchases';
import { combineLatest } from 'rxjs';

import { P9PurchasesService } from '../';
import { useDependency } from '../../di';
import { P9PurchasesQuery } from './purchases.query';

/**
 * Returns the packages available for purchase.
 * @returns PurchasesPackage[]
 */
export function useAvailablePackages() {
  const query = useDependency(P9PurchasesQuery);

  return useObservableState(
    useObservable(() => query.availablePackages$),
    [],
  );
}

/**
 * Returns information about the active entitlement.
 * @returns PurchasesEntitlementInfo
 */
export function useActiveSubscription() {
  const query = useDependency(P9PurchasesQuery);
  return useObservableState(useObservable(() => query.activeSubscription$));
}

/**
 * Sets up the RevenueCat Purchases SDK
 */
export const usePurchasesSetup = (): void => {
  const service = useDependency(P9PurchasesService);

  useEffect(() => {
    return service.setup();
  }, [service]);
};

/**
 * Returns a function that handles purchasing a subscription package
 */

export type P9PurchaseSubscriptionFn = (subscription: PurchasesPackage) => void;

export const usePurchaseSubscription = (): P9PurchaseSubscriptionFn => {
  const service = useDependency(P9PurchasesService);
  return useCallback((subscription: PurchasesPackage) => service.purchaseSubscription(subscription), [service]);
};

/**
 * Returns a function that handles retoring a previous purchase
 */

export type P9RestoreSubscriptionFn = () => void;

export const useRestoreSubscription = (): P9RestoreSubscriptionFn => {
  const service = useDependency(P9PurchasesService);
  return useCallback(() => service.restoreSubscription(), [service]);
};

/**
 * Returns a UI state object that updates with each change to the underlying queries.
 */

export interface P9PurchasesUIState {
  activeSubscription?: PurchasesEntitlementInfo;
  error?: any;
  loading: boolean;
  packages: PurchasesPackage[];
}

export function usePurchasesUIState(): P9PurchasesUIState {
  const query = useDependency(P9PurchasesQuery);

  return useObservableState(
    useObservable(() =>
      combineLatest({
        activeSubscription: query.activeSubscription$,
        error: query.selectError(),
        loading: query.selectLoading(),
        packages: query.availablePackages$,
      }),
    ),
    { loading: false, packages: [] } as P9PurchasesUIState,
  );
}

/**
 * Returns a guard function that prompts a user to trial a subscription if one is not currently active.
 * @param callToAction The main call to action to present in the modal
 * @param prompt The secondary call to action to present in the modal
 * @param resolve A callback to execute when the guard passes
 * @param reject An optional callback to execute when the guard fails
 * @returns A guard function
 */
export const useActiveEntitlementGuard = (
  callToAction: string,
  prompt: string,
  predicate?: () => boolean,
  resolve?: () => void,
  reject?: () => void,
): ((resolve?: () => void, reject?: () => void) => void) => {
  const service = useDependency(P9PurchasesService);
  const state = usePurchasesUIState();

  return useCallback(
    async (onResolve?: () => void, onReject?: () => void) => {
      if (state.activeSubscription || predicate?.()) {
        resolve?.();
        onResolve?.();
      } else {
        Alert.alert('Power 9+', `${callToAction} ${prompt}`, [
          { text: 'Maybe Later', style: 'cancel' },
          {
            text: 'Start Free Trial',
            onPress: () =>
              service
                .trialSubscription()
                .then(() => {
                  resolve?.();
                  onReject?.();
                })
                .catch(reject),
          },
        ]);
      }
    },
    [callToAction, predicate, prompt, reject, resolve, service, state.activeSubscription],
  );
};
