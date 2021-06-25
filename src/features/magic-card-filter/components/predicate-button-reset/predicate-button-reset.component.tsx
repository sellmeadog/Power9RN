import React, { FunctionComponent } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from 'react-native-elements';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface P9PredicateResetButtonProps {
  canReset?: boolean;
  onPress?(): void;
  type?: 'group' | 'scalar';
}

export const P9PredicateResetButton: FunctionComponent<P9PredicateResetButtonProps> = ({
  canReset = true,
  onPress,
  type = 'scalar',
}) => {
  const opacityValue = useSharedValue(1);
  const opacityStyle = useAnimatedStyle(
    (): ViewStyle => ({ opacity: withTiming(opacityValue.value, { duration: 100 }) }),
  );

  if (!canReset) {
    return null;
  }

  return (
    <Pressable
      onPressIn={() => (opacityValue.value = 0.4)}
      onPressOut={() => (opacityValue.value = 1)}
      onPress={onPress}
      style={P9PredicateResetButtonTheme.container}
    >
      <Animated.View style={[opacityStyle]}>
        <Icon
          name={type === 'group' ? 'minus-circle-multiple-outline' : 'minus-circle-outline'}
          size={17}
          type={'material-community'}
          style={type === 'group' ? P9PredicateResetButtonTheme.iconGroup : P9PredicateResetButtonTheme.iconScalar}
        />
      </Animated.View>
    </Pressable>
  );
};

const P9PredicateResetButtonTheme = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 44,
    width: 44,
    paddingRight: 10,
  },

  iconGroup: {
    marginRight: 1.5,
  },

  iconScalar: {
    marginRight: 0,
  },
});
