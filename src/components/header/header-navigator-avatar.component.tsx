import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Avatar, AvatarProps } from 'react-native-elements';

import { DrawerActions, useNavigation } from '@react-navigation/native';

import { useAuthorizationFacade } from '../../core/authorization';
import { usePower9Theme } from '../../core/theme';

export interface P9DrawerNavigatorAvatarProps {}

export const P9DrawerNavigatorAvatar: FunctionComponent<P9DrawerNavigatorAvatarProps> = () => {
  const [{ user }] = useAuthorizationFacade();
  const [{ colors }] = usePower9Theme();
  const [toggleDrawer] = useToggleDrawer();

  const props = useMemo(
    () =>
      user?.providerType === 'anon-user' || !user?.profile.pictureUrl
        ? ({ icon: { color: colors?.primary, name: 'menu', size: 19 } } as AvatarProps)
        : ({ source: user?.profile.pictureUrl } as AvatarProps),
    [colors, user],
  );

  return <Avatar onPress={toggleDrawer} {...props} />;
};

const useToggleDrawer = (): [toggleDrawer: () => void] => {
  const { dispatch } = useNavigation();
  const toggleDrawer = useCallback(() => dispatch(DrawerActions.toggleDrawer()), [dispatch]);

  return [toggleDrawer];
};
