import React, { FunctionComponent } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface P9SpringPressableProps extends PressableProps {
  stiffness?: number;
}

export const P9SpringPressable: FunctionComponent<P9SpringPressableProps> = ({
  children,
  stiffness = 300,
  style,
  ...rest
}) => {
  const springConfig = { stiffness };

  const pressed = useSharedValue(1);

  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    return { transform: [{ scale: pressed.value }] };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(0.6, springConfig);
  };

  const handlePressOut = () => {
    pressed.value = withSpring(1, springConfig);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={style} {...rest}>
      <Animated.View style={[animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

const P9SpringPressableTheme = StyleSheet.create({});
