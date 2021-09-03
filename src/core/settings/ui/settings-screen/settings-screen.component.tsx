import React, { FunctionComponent } from 'react';

import {
  P9DrawerNavigatorHeader,
  P9ItemSeparator,
  P9TableDivider,
  P9TableViewActionItem,
} from '../../../../components';
import { P9SubscriptionSettings } from './settings-subscription.component';

export interface P9SettingsScreenProps {}

export const P9SettingsScreen: FunctionComponent<P9SettingsScreenProps> = () => {
  return (
    <>
      <P9DrawerNavigatorHeader />
      <P9TableDivider title={'Account'} />
      <P9TableViewActionItem title={'My Account'} onPress={() => console.log('My Account')} />
      <P9ItemSeparator />
      <P9TableViewActionItem title={'Create Account'} />
      <P9SubscriptionSettings />
      <P9ItemSeparator />
    </>
  );
};
