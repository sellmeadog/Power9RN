import React, { FunctionComponent, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { P9MagicCardImagePlaceholder } from './magic-card-image-placeholder.component';
import { P9MagicCardImageTheme } from './magic-card-image.theme';

export interface P9MagicCardImageProps {
  sourceUri?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export const P9MagicCardImage: FunctionComponent<P9MagicCardImageProps> = ({
  sourceUri,
  containerStyle,
  imageContainerStyle,
  imageStyle,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[P9MagicCardImageTheme.containerStyle, containerStyle]}>
      <View style={[P9MagicCardImageTheme.imageContainerStyle, imageContainerStyle]}>
        <P9MagicCardImagePlaceholder hasError={hasError} />
        <FastImage
          onError={() => setHasError(true)}
          source={{ uri: sourceUri }}
          style={[P9MagicCardImageTheme.imageStyle, imageStyle]}
        />
      </View>
    </View>
  );
};
