import React, { FunctionComponent } from 'react';
import { ViewStyle } from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { P9SpringButton, P9SpringButtonProps } from '../button-spring/spring-button';

export interface P9ToggleButtonProps extends P9SpringButtonProps {
  active?: boolean;
  activeBackgroundColor?: string;
  activeTintColor?: string;
  inactiveBackgroundColor?: string;
  inactiveOpacity?: number;
  inactiveTintColor?: string;
  onToggle?(value: string, active: boolean): void;
  value?: string;
}

export const P9ToggleButton: FunctionComponent<P9ToggleButtonProps> = ({
  active = false,
  children,
  inactiveOpacity = 0.6,
  onPress,
  onToggle,
  value,
  ...rest
}) => {
  const timingConfig = { duration: 300 };
  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    return { opacity: withTiming(active ? 1 : inactiveOpacity, timingConfig) };
  });

  const handlePress = () => {
    onPress?.();

    if (value) {
      onToggle?.(value, !active);
    }
  };

  return (
    <P9SpringButton contentStyle={animatedStyle} {...rest} onPress={handlePress}>
      {children}
    </P9SpringButton>
  );
};
