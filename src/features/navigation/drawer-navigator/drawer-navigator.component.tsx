import React, { FunctionComponent } from 'react';
import { Icon } from 'react-native-elements/dist/icons/Icon';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { P9SettingsNavigator } from '../../../core/settings';
import { withFlag } from '../../../core/types';
import { P9DecklistExplorerNavigator } from '../../decklist-explorer';
import { P9DeveloperNavigator } from '../../developer';
import { P9MagicCardFeatureNavigator } from '../../magic-cards';
import { P9DrawerContent } from '../drawer-content/drawer-content.component';

const { Navigator, Screen } = createDrawerNavigator();

export interface P9DrawerNavigatorProps {}

export const P9DrawerNavigator: FunctionComponent<P9DrawerNavigatorProps> = () => {
  return (
    <Navigator
      drawerContent={(props) => <P9DrawerContent {...props} />}
      drawerContentOptions={{ labelStyle: { marginLeft: -20 } }}
    >
      <Screen
        name={'P9:Drawer:Home'}
        component={P9MagicCardFeatureNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon color={color} name={'cards'} size={size} type={'material-community'} />
          ),
          title: 'Cards',
        }}
      />
      <Screen
        name={'P9:Drawer:DecklistExplorer'}
        component={P9DecklistExplorerNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon color={color} name={'archive'} size={size} type={'material-community'} />
          ),
          title: 'Decks',
        }}
      />
      <Screen
        name={'P9:Drawer:Settings'}
        component={P9SettingsNavigator}
        options={{
          drawerIcon: ({ color, size }) => <Icon color={color} name={'settings'} size={size} />,
          title: 'Settings',
        }}
      />
      {withFlag(
        'P9_FLAG_DEVELOPER_SCREEN',
        <Screen
          name={'P9:Drawer:Developer'}
          component={P9DeveloperNavigator}
          options={{
            drawerIcon: ({ color, size }) => <Icon color={color} name={'code'} size={size} />,
            title: 'Developer',
          }}
        />,
      )}
    </Navigator>
  );
};
