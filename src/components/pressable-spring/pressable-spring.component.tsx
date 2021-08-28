import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface P9SpringPressableProps extends PressableProps {
  springValue?: number;
  stiffness?: number;
}

export const P9SpringPressable: FunctionComponent<P9SpringPressableProps> = ({
  children,
  springValue = 0.6,
  stiffness = 300,
  style,
  ...rest
}) => {
  const springConfig: Animated.WithSpringConfig = useMemo(() => ({ stiffness }), [stiffness]);
  const pressed = useSharedValue(1);

  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    return { transform: [{ scale: pressed.value }] };
  });

  const handlePressIn = useCallback(() => {
    pressed.value = withSpring(springValue, springConfig);
  }, [pressed, springConfig, springValue]);

  const handlePressOut = useCallback(() => {
    pressed.value = withSpring(1, springConfig);
  }, [pressed, springConfig]);

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={style} {...rest}>
      <Animated.View style={[animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};
