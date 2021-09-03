import React, { FunctionComponent } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { P9DeveloperScreen } from '../developer-screen/developer.screen';

const { Navigator, Screen } = createStackNavigator();

export interface P9DeveloperNavigatorProps {}

export const P9DeveloperNavigator: FunctionComponent<P9DeveloperNavigatorProps> = () => {
  return (
    <Navigator headerMode={'none'}>
      <Screen name={'P9:Drawer:Developer:Home'} component={P9DeveloperScreen} />
    </Navigator>
  );
};
