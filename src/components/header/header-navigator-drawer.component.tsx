import React, { FunctionComponent } from 'react';
import { Header, HeaderProps } from 'react-native-elements';

import { P9DrawerNavigatorAvatar } from './header-navigator-avatar.component';

export interface P9DrawerNavigatorHeaderProps extends Omit<HeaderProps, 'leftComponent'> {}

export const P9DrawerNavigatorHeader: FunctionComponent<P9DrawerNavigatorHeaderProps> = ({
  centerContainerStyle,
  children,
  leftContainerStyle,
  rightContainerStyle,
  ...rest
}) => {
  return (
    <Header
      centerContainerStyle={[centerContainerStyle]}
      leftComponent={<P9DrawerNavigatorAvatar />}
      leftContainerStyle={[leftContainerStyle]}
      rightContainerStyle={[rightContainerStyle]}
      {...rest}
    >
      {children}
    </Header>
  );
};
