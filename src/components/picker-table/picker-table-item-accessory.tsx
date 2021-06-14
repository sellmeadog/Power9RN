import React, { FunctionComponent } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { usePower9Theme } from '../../core/theme';

export interface P9TablePickerItemAccessoryProps {
  selected?: boolean;
  containerStyle?: Animated.AnimatedStyleProp<ViewStyle>;
}

export const P9TablePickerItemAccessory: FunctionComponent<P9TablePickerItemAccessoryProps> = ({
  selected = false,
  containerStyle,
}) => {
  const [{ Icon }] = usePower9Theme();

  const opacity = useDerivedValue(() => Number(selected), [selected]);
  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 50 }),
    };
  }, [selected]);

  return (
    <Animated.View style={[containerStyle, opacityStyle]}>
      <MaterialIcon {...Icon} name={'check'} />
    </Animated.View>
  );
};
