import React, { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { P9ImageFunctionComponent } from '../../../../core/types';
import { P9MagicCardImagePlaceholder } from './magic-card-image-placeholder.component';
import { P9MagicCardImageTheme } from './magic-card-image.theme';

export interface P9MagicCardImageProps {
  borderRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  sourceUri?: string;
}

export const P9MagicCardImage: P9ImageFunctionComponent<P9MagicCardImageProps> = ({
  borderRadius = 10,
  containerStyle,
  imageContainerStyle,
  imageStyle,
  sourceUri,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[P9MagicCardImageTheme.containerStyle, { borderRadius }, containerStyle]}>
      <View style={[P9MagicCardImageTheme.imageContainerStyle, { borderRadius }, imageContainerStyle]}>
        <P9MagicCardImagePlaceholder hasError={hasError} />
        <FastImage
          onError={() => setHasError(true)}
          source={{ uri: sourceUri }}
          style={[P9MagicCardImageTheme.imageStyle, { borderRadius }, imageStyle]}
        />
      </View>
    </View>
  );
};

P9MagicCardImage.ASPECT_RATIO = 0.71794871794;
