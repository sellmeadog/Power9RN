import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { usePower9Theme } from '../../../theme';
import { P9SettingsScreen } from './settings-screen.component';

const { Navigator, Screen } = createStackNavigator();

export interface P9SettingsNavigatorProps {}

export const P9SettingsNavigator: FunctionComponent<P9SettingsNavigatorProps> = () => {
  const [{ colors }] = usePower9Theme();

  return (
    <Navigator screenOptions={{ cardStyle: { backgroundColor: colors?.grey0 }, headerShown: false }}>
      <Screen name={'P9:Drawer:Settings:Home'} component={P9SettingsScreen} />
    </Navigator>
  );
};
