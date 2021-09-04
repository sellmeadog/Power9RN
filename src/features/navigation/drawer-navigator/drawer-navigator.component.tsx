import React, { FunctionComponent } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { P9SettingsNavigator } from '../../../core/settings';
import { withFlag } from '../../../core/types';
import { P9DecklistExplorerNavigator } from '../../decklist-explorer';
import { P9DeveloperNavigator } from '../../developer';
import { P9MagicCardFeatureNavigator } from '../../magic-cards';

const { Navigator, Screen } = createDrawerNavigator();

export interface P9DrawerNavigatorProps {}

export const P9DrawerNavigator: FunctionComponent<P9DrawerNavigatorProps> = () => {
  return (
    <Navigator>
      <Screen name={'P9:Drawer:Home'} component={P9MagicCardFeatureNavigator} options={{ title: 'Home' }} />
      <Screen
        name={'P9:Drawer:DecklistExplorer'}
        component={P9DecklistExplorerNavigator}
        options={{ title: 'Decks' }}
      />
      <Screen name={'P9:Drawer:Settings'} component={P9SettingsNavigator} options={{ title: 'Settings' }} />
      {withFlag(
        'P9_FLAG_DEVELOPER_SCREEN',
        <Screen name={'P9:Drawer:Developer'} component={P9DeveloperNavigator} options={{ title: 'Developer' }} />,
      )}
    </Navigator>
  );
};
