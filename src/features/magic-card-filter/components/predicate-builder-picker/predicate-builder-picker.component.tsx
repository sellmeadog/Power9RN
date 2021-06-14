import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useNavigation } from '@react-navigation/core';

import { usePower9Theme } from '../../../../core/theme';

export interface P9PickerPredicateBuilderProps {
  attribute: string;
  placeholder: string;
  route: string;
}

export const P9PickerPredicateBuilder: FunctionComponent<P9PickerPredicateBuilderProps> = ({ placeholder, route }) => {
  const { navigate } = useNavigation();
  const [{ colors }] = usePower9Theme();
  const animated = useSharedValue(colors!.background!);

  const pressedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(animated.value, { duration: 100 }),
    };
  });

  const handlePress = useCallback(() => navigate(route), [navigate, route]);

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (animated.value = colors!.grey0!)}
        onPressOut={() => (animated.value = colors!.background!)}>
        <Animated.View style={[P9PickerPredicateBuilderTheme.pressable, pressedStyle]}>
          <Text>{placeholder}</Text>
          <Icon name={'arrow-forward-ios'} />
        </Animated.View>
      </Pressable>
    </>
  );
};

const P9PickerPredicateBuilderTheme = StyleSheet.create({
  pressable: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
