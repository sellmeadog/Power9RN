import React, { FunctionComponent } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { P9MagicCardImage } from '../../magic-cards';

export interface P9MagicCardDetailParallaxForegroundProps {
  scrollOffset: number;
  scrollY: Animated.SharedValue<number>;
  sourceUri?: string;
}

export const P9MagicCardDetailParallaxForeground: FunctionComponent<P9MagicCardDetailParallaxForegroundProps> = ({
  scrollOffset,
  scrollY,
  sourceUri,
}) => {
  const { height } = useWindowDimensions();
  const parallaxContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY?.value || 0, [0, scrollOffset - 22, scrollOffset], [1, 1, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, scrollOffset], [0, scrollOffset * -1.1], {
          extrapolateLeft: Extrapolate.CLAMP,
        }),
      },
      {
        scale: interpolate(scrollY.value, [-height, 0], [2, 1], Extrapolate.CLAMP),
      },
    ],
  }));

  return (
    <Animated.View
      style={[P9MagicCardDetailParallaxForegroundTheme.parallaxContainer, parallaxContainerStyle]}
      pointerEvents={'none'}
    >
      <P9MagicCardImage
        containerStyle={[P9MagicCardDetailParallaxForegroundTheme.foregroundContainer]}
        imageContainerStyle={[P9MagicCardDetailParallaxForegroundTheme.foregroundImageContainer]}
        imageStyle={[P9MagicCardDetailParallaxForegroundTheme.foregroundImageContainer]}
        sourceUri={sourceUri}
      />
    </Animated.View>
  );
};

const status_bar_height = getStatusBarHeight();

const P9MagicCardDetailParallaxForegroundTheme = StyleSheet.create({
  parallaxContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 1,
  },

  foregroundContainer: {
    paddingTop: status_bar_height + 10,
    paddingHorizontal: 40,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  foregroundImageContainer: {
    borderRadius: 16,
  },
});
