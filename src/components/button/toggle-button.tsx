import React, { FunctionComponent } from 'react';
import { ViewStyle } from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { P9SpringButton, P9SpringButtonProps } from './spring-button';

export interface P9ToggleButtonProps extends P9SpringButtonProps {
  active?: boolean;
  activeBackgroundColor?: string;
  activeTintColor?: string;
  inactiveBackgroundColor?: string;
  inactiveOpacity?: number;
  inactiveTintColor?: string;
}

export const P9ToggleButton: FunctionComponent<P9ToggleButtonProps> = ({
  active = false,
  children,
  inactiveOpacity = 0.6,
  ...rest
}) => {
  const timingConfig = { duration: 300 };
  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    return { opacity: withTiming(active ? 1 : inactiveOpacity, timingConfig) };
  });

  return (
    <P9SpringButton contentStyle={animatedStyle} {...rest}>
      {children}
    </P9SpringButton>
  );
};
