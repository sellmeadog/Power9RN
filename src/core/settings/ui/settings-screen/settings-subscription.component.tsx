import React, { FunctionComponent, useCallback, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import { P9ItemSeparator, P9TableDivider, P9TableViewActionItem, P9TableViewTextItem } from '../../../../components';
import { P9RestoreSubscriptionFn, useRestoreSubscription } from '../../../purchases';
import { P9PurchasesUIState, usePurchasesUIState } from '../../../purchases/state/purchases.query';

export interface P9SubscriptionSettingsProps {}

export const P9SubscriptionSettings: FunctionComponent<P9SubscriptionSettingsProps> = () => {
  const [{ activeSubscription }, handlePurchase, handleRestore] = useSubscriptionSettingsUIFacade();
  const title = useMemo(() => {
    return activeSubscription
      ? activeSubscription.productIdentifier.includes('YEAR')
        ? 'Annual Subscriber'
        : 'Monthly Subscriber'
      : 'Subscribe';
  }, [activeSubscription]);

  return (
    <>
      <P9TableDivider borderTop title={'Power 9+'} />
      <P9TableViewActionItem accessory={'arrow-forward-ios'} onPress={handlePurchase} primary title={title} />
      <P9ItemSeparator />
      <P9TableViewActionItem
        action
        disabled={!!activeSubscription}
        onPress={handleRestore}
        title={'Restore Subscription'}
      />
      <P9TableViewTextItem
        text={['Subscriptions auto-renew within 24 hours of expiration unless cancelled in your Apple account.']}
      />
    </>
  );
};

export const useSubscriptionSettingsUIFacade = (): [
  state: P9PurchasesUIState,
  purchaseSubscription: () => void,
  restoreSubscription: P9RestoreSubscriptionFn,
] => {
  const { navigate } = useNavigation();

  return [
    usePurchasesUIState(),
    useCallback(() => navigate('P9:Modal:Purchases'), [navigate]),
    useRestoreSubscription(),
  ];
};
