import React, { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { P9SpringButton, P9SpringButtonProps } from '../button-spring/spring-button';

export interface P9ToggleButtonProps<T = string> extends P9SpringButtonProps {
  active?: boolean;
  activeBackgroundColor?: string;
  activeTintColor?: string;
  inactiveBackgroundColor?: string;
  inactiveOpacity?: number;
  inactiveTintColor?: string;
  onToggle?(value: T, active: boolean): void;
  value?: T;
}

export function P9ToggleButton<T = string>({
  active = false,
  activeBackgroundColor,
  activeTintColor,
  children,
  inactiveOpacity = 0.6,
  onPress,
  onToggle,
  value,
  ...rest
}: PropsWithChildren<P9ToggleButtonProps<T>>) {
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
    <P9SpringButton
      backgroundColor={active ? activeBackgroundColor : undefined}
      contentStyle={animatedStyle}
      tintColor={active ? activeTintColor : undefined}
      {...rest}
      onPress={handlePress}
    >
      {children}
    </P9SpringButton>
  );
}
