import React, { FunctionComponent } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { P9DrawerNavigator } from '../drawer-navigator/drawer-navigator.component';

const { Navigator, Screen } = createStackNavigator();

export interface P9NavigationContainerProps {}

export const P9NavigationContainer: FunctionComponent<P9NavigationContainerProps> = () => {
  return (
    <NavigationContainer>
      <Navigator headerMode={'none'} mode={'modal'}>
        <Screen name={'P9:Drawer'} component={P9DrawerNavigator} />
      </Navigator>
    </NavigationContainer>
  );
};
