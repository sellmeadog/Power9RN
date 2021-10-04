import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9LoginScreen } from './login.screen';

const { Navigator, Screen } = createStackNavigator();

export interface P9AuthorizationNavigatorProps {}

export const P9AuthorizationNavigator: FunctionComponent<P9AuthorizationNavigatorProps> = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={'P9:Authorization:Login'} component={P9LoginScreen} />
    </Navigator>
  );
};
