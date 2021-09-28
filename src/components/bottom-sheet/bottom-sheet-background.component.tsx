import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';

import { usePower9Theme } from '../../core/theme';

export interface P9BottomSheetBackgroundProps extends BottomSheetBackgroundProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const P9BottomSheetBackground: FunctionComponent<P9BottomSheetBackgroundProps> = ({
  animatedIndex,
  elevation,
  style,
}) => {
  const [{ colors }] = usePower9Theme();
  const color = useMemo(() => {
    switch (elevation) {
      case 0:
        return colors?.grey0;

      case 1:
        return colors?.grey1;

      default:
      case 2:
        return colors?.grey2;

      case 3:
        return colors?.grey3;

      case 4:
        return colors?.grey4;

      case 5:
        return colors?.grey5;
    }
  }, [colors, elevation]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(animatedIndex.value, [0, 1], [color!, color!]),
    }),
    [colors, elevation],
  );

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
