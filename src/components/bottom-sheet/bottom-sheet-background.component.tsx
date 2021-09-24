import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';

import { usePower9Theme } from '../../core/theme';

export interface P9BottomSheetBackgroundProps extends BottomSheetBackgroundProps {}

export const P9BottomSheetBackground: FunctionComponent<P9BottomSheetBackgroundProps> = ({ animatedIndex, style }) => {
  const [{ colors }] = usePower9Theme();
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedIndex.value, [0, 1], [colors!.grey2!, colors!.grey2!]),
  }));

  return (
    <Animated.View
      pointerEvents={'none'}
      style={[animatedStyle, P9DecklistEditorBottomSheetTheme.backgroundContainer, style]}
    />
  );
};

const P9DecklistEditorBottomSheetTheme = StyleSheet.create({
  backgroundContainer: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
});
