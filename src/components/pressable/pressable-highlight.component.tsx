import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { usePower9Theme } from '../../core/theme';

export interface P9PressableHighlightProps extends Omit<PressableProps, 'onPressIn' | 'onPressOut'> {
  activeColor?: string;
  inactiveColor?: string;
  pressableContainerStyle?: StyleProp<ViewStyle>;
}

export const P9PressableHighlight: FunctionComponent<P9PressableHighlightProps> = ({
  activeColor,
  children,
  inactiveColor,
  pressableContainerStyle,
  onLongPress,
  onPress,
  ...rest
}) => {
  const [{ colors }] = usePower9Theme();

  const animatedHighlightColor = useSharedValue(inactiveColor ?? colors?.background);
  const animatedHighlightStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(animatedHighlightColor.value!, { duration: 100 }),
    };
  });

  const handlePressIn = useCallback(() => {
    if (onLongPress || onPress) {
      animatedHighlightColor.value = activeColor ?? colors!.grey0;
    }
  }, [activeColor, animatedHighlightColor, colors, onLongPress, onPress]);

  const handlePressOut = useCallback(() => {
    if (onLongPress || onPress) {
      animatedHighlightColor.value = inactiveColor ?? colors!.background;
    }
  }, [animatedHighlightColor, colors, inactiveColor, onLongPress, onPress]);

  return (
    <Pressable {...rest} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[animatedHighlightStyle, P9PressableHighlightTheme.container, pressableContainerStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const P9PressableHighlightTheme = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
