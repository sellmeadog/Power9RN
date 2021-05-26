import React, { FunctionComponent, useMemo } from 'react';

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { usePower9Theme } from '../../../core/theme';
import { P9AuthorizationNavigator } from '../../authorization/components/authorization.navigator';
import { P9DrawerNavigator } from '../drawer-navigator/drawer-navigator.component';

const { Navigator, Screen } = createStackNavigator();

export interface P9NavigationContainerProps {}

export const P9NavigationContainer: FunctionComponent<P9NavigationContainerProps> = () => {
  const [{ colors }] = usePower9Theme();
  const theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: { ...DefaultTheme.colors, ...colors },
    }),
    [colors],
  );

  return (
    <NavigationContainer theme={theme}>
      <Navigator headerMode={'none'} mode={'modal'}>
        <Screen name={'P9:Drawer'} component={P9DrawerNavigator} />
        <Screen name={'P9:Authorization'} component={P9AuthorizationNavigator} />
      </Navigator>
    </NavigationContainer>
  );
};
