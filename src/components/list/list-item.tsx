import React, { FunctionComponent } from 'react';

import Animated from 'react-native-reanimated';
import { P9ListTheme } from './list.theme';
import { ViewProps } from 'react-native';

export interface P9ListItemProps extends Animated.AnimateProps<ViewProps> {}

export const P9ListItem: FunctionComponent<P9ListItemProps> = ({ children, style, ...rest }) => {
  return (
    <Animated.View style={[P9ListTheme.listItemContainer, style]} {...rest}>
      {children}
    </Animated.View>
  );
};
