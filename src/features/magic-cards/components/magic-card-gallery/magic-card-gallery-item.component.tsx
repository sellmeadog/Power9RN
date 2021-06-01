import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { P9MagicCardFace } from '../../../../core/public';
import { P9MagicCardImage } from '../magic-card-image/magic-card-image.component';

export interface P9MagicCardGalleryItemProps {
  booster: boolean | null | undefined;
  card_faces: P9MagicCardFace[];
  containerStyle?: StyleProp<ViewStyle>;
  index: number;
  onPress?(index: number): void;
}

export const P9MagicCardGalleryItem: FunctionComponent<P9MagicCardGalleryItemProps> = ({
  card_faces,
  containerStyle,
  index,
  onPress,
}) => {
  const handlePress = useCallback(() => onPress?.(index), [index, onPress]);

  if (card_faces.length === 1) {
    return (
      <Pressable onPress={handlePress}>
        <View style={[P9MagicCardGalleryItemStyle.container, containerStyle]}>
          <P9MagicCardImage sourceUri={card_faces[0].image_uris?.large as string | undefined} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <View style={[P9MagicCardGalleryItemStyle.container, containerStyle]}>
        {card_faces.map(({ image_uris }, key) => (
          <P9MagicCardImage
            key={key}
            containerStyle={key === 0 ? P9MagicCardGalleryItemStyle.frontFace : P9MagicCardGalleryItemStyle.backFace}
            sourceUri={image_uris?.large as string | undefined}
          />
        ))}
      </View>
    </Pressable>
  );
};

const P9MagicCardGalleryItemStyle = StyleSheet.create({
  container: {
    aspectRatio: 0.71794871794,
    flexGrow: 1,
    paddingRight: 10,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  frontFace: {
    position: 'absolute',
    left: 0,
    bottom: 13,
    width: '90%',
    zIndex: 1,
  },

  backFace: {
    position: 'absolute',
    right: 10,
    top: 0,
    width: '90%',
  },
});
