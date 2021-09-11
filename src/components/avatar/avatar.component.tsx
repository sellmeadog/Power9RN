import React, { FunctionComponent, useMemo } from 'react';
import { Avatar, AvatarProps } from 'react-native-elements';

import { useAuthorizationFacade } from '../../core/authorization';
import { usePower9Theme } from '../../core/theme';

export interface P9AvatarProps extends AvatarProps {}

export const P9Avatar: FunctionComponent<P9AvatarProps> = ({ icon, source: _, ...rest }) => {
  const [{ isAnonymous, user }] = useAuthorizationFacade();
  const [{ colors }] = usePower9Theme();

  const props = useMemo(
    () =>
      isAnonymous
        ? ({ icon: { color: colors?.primary, name: 'menu', size: 19, ...icon }, ...rest } as AvatarProps)
        : ({
            ...rest,
            source: { uri: user?.customData?.picture_url },
          } as AvatarProps),
    [colors, icon, isAnonymous, rest, user],
  );

  return <Avatar {...props} />;
};
