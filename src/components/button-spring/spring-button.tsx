import React, { FunctionComponent } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Icon, IconProps } from 'react-native-elements';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { usePower9Theme } from '../../core/theme';

const BUTTON_WIDTH = 32;

export interface P9SpringButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  iconProps?: IconProps;
  onPress?(): void;
  onLongPress?(): void;
}

export const P9SpringButton: FunctionComponent<P9SpringButtonProps> = ({
  buttonStyle,
  children,
  containerStyle,
  contentStyle,
  iconProps,
  onPress,
  onLongPress,
}) => {
  const springConfig = { stiffness: 300 };

  const pressed = useSharedValue(1);
  const [{ colors }] = usePower9Theme();

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
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[P9SpringButtonTheme.container, containerStyle]}>
      <Animated.View
        style={[
          P9SpringButtonTheme.button,
          { backgroundColor: colors?.backgroundInput, borderColor: colors?.border },
          buttonStyle,
        ]}>
        <Animated.View style={[P9SpringButtonTheme.contentContainer, animatedStyle, contentStyle]}>
          {iconProps ? <Icon color={colors?.primary} size={19} {...iconProps} /> : children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const P9SpringButtonTheme = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 44,
    minWidth: BUTTON_WIDTH,
  },

  button: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    aspectRatio: 1,
    borderRadius: BUTTON_WIDTH / 2,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    width: BUTTON_WIDTH,
  },

  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
