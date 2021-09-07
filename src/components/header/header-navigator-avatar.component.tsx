import React, { FunctionComponent, useCallback } from 'react';

import { DrawerActions, useNavigation } from '@react-navigation/native';

import { P9Avatar } from '../avatar/avatar.component';

export interface P9DrawerNavigatorAvatarProps {}

export const P9DrawerNavigatorAvatar: FunctionComponent<P9DrawerNavigatorAvatarProps> = () => {
  const { dispatch } = useNavigation();
  const toggleDrawer = useCallback(() => dispatch(DrawerActions.toggleDrawer()), [dispatch]);

  return <P9Avatar onPress={toggleDrawer} />;
};
