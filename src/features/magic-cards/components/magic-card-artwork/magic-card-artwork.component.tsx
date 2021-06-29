import React, { useState } from 'react';
import { ImageProps, ImageStyle, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { P9ImageFunctionComponent } from '../../../../core/types';
import { P9MagicCardImagePlaceholder } from '../magic-card-image/magic-card-image-placeholder.component';

export interface P9MagicCardArtworkProps {
  animatedProps?: Partial<ImageProps>;
  blurRadius?: number;
  blurValue?: Animated.SharedValue<number>;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  sourceUri?: string;
}

export const P9MagicCardArtwork: P9ImageFunctionComponent<P9MagicCardArtworkProps> = ({
  animatedProps,
  containerStyle,
  imageContainerStyle,
  imageStyle,
  sourceUri,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Animated.View style={[P9MagicCardArtworkTheme.containerStyle, containerStyle]}>
      <Animated.View style={[P9MagicCardArtworkTheme.imageContainerStyle, imageContainerStyle]}>
        <P9MagicCardImagePlaceholder hasError={hasError} />
        <Animated.Image
          animatedProps={animatedProps}
          onError={() => setHasError(true)}
          source={{ uri: sourceUri }}
          style={[P9MagicCardArtworkTheme.image, imageStyle]}
        />
      </Animated.View>
    </Animated.View>
  );
};

P9MagicCardArtwork.ASPECT_RATIO = 1.36980306346;

const P9MagicCardArtworkTheme = StyleSheet.create({
  containerStyle: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
  },

  imageContainerStyle: {
    overflow: 'hidden',
  },

  image: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
  },
});
