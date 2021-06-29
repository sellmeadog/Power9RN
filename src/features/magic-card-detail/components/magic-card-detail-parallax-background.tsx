import React, { FunctionComponent } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  createAnimatedPropAdapter,
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { P9MagicCardArtwork } from '../../magic-cards';

export interface P9MagicCardDetailParallaxBackgroundProps {
  scrollOffset: number;
  scrollY: Animated.SharedValue<number>;
  sourceUri?: string;
}

export const P9MagicCardDetailParallaxBackground: FunctionComponent<P9MagicCardDetailParallaxBackgroundProps> = ({
  scrollOffset,
  scrollY,
  sourceUri,
}) => {
  const animatedImageProps = useAnimatedProps(
    () => ({
      blurRadius: scrollY ? interpolate(scrollY.value, [0, 300], [8, 16]) : 0,
    }),
    [scrollY],
    animatedImagePropsAdapter,
  );

  const parallaxBackgroundStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, scrollOffset], [0, scrollOffset * -0.1], Extrapolate.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [-height, 0], [2, 1], Extrapolate.CLAMP),
      },
    ],
  }));

  return (
    <P9MagicCardArtwork
      animatedProps={animatedImageProps}
      containerStyle={[StyleSheet.absoluteFill]}
      imageContainerStyle={[parallaxBackgroundStyle]}
      sourceUri={sourceUri}
    />
  );
};

const { height } = Dimensions.get('window');

const animatedImagePropsAdapter = createAnimatedPropAdapter(
  (props: any) => {
    props.radius = props.blurRadius;
  },
  ['radius'],
);
