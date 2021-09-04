import React, { FunctionComponent } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { P9DrawerNavigatorHeader } from '../../../../components';
import { P9AccountSettings } from './settings-account.component';
import { P9LegalSettings } from './settings-legal.component';
import { P9SubscriptionSettings } from './settings-subscription.component';
import { P9SupportSettings } from './settings-support.component';

export interface P9SettingsScreenProps {}

export const P9SettingsScreen: FunctionComponent<P9SettingsScreenProps> = () => {
  return (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'Settings' }} />
      <ScrollView>
        <P9AccountSettings />
        <P9SubscriptionSettings />
        <P9SupportSettings />
        <P9LegalSettings />
      </ScrollView>
    </>
  );
};
