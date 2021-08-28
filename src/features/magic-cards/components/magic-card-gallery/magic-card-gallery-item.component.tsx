import React, { FunctionComponent, memo, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { P9MagicCard } from '../../../../core/public';
import { P9MagicCardImage } from '../magic-card-image/magic-card-image.component';

export interface P9MagicCardGalleryItemProps {
  containerStyle?: StyleProp<ViewStyle>;
  index: number;
  magicCard: P9MagicCard;
  onPress?(magicCard: P9MagicCard, index: number): void;
}

export const P9MagicCardGalleryItem: FunctionComponent<P9MagicCardGalleryItemProps> = memo(
  ({ containerStyle, index, magicCard, onPress }) => {
    const pressed = useSharedValue(1);
    const scaleStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(pressed.value, { stiffness: 300 }) }],
    }));

    const handlePress = useCallback(() => onPress?.(magicCard, index), [magicCard, index, onPress]);

    if (magicCard.card_faces.length === 1) {
      return (
        <Pressable
          onPressIn={() => (pressed.value = 0.95)}
          onPressOut={() => (pressed.value = 1)}
          onPress={handlePress}
        >
          <Animated.View style={[P9MagicCardGalleryItemStyle.container, containerStyle, scaleStyle]}>
            <P9MagicCardImage sourceUri={magicCard.card_faces[0].image_uris?.large as string | undefined} />
          </Animated.View>
        </Pressable>
      );
    }

    return (
      <Pressable onPressIn={() => (pressed.value = 0.95)} onPressOut={() => (pressed.value = 1)} onPress={handlePress}>
        <Animated.View style={[P9MagicCardGalleryItemStyle.container, containerStyle, scaleStyle]}>
          {magicCard.card_faces.map(({ image_uris }, key) => (
            <P9MagicCardImage
              key={key}
              containerStyle={key === 0 ? P9MagicCardGalleryItemStyle.frontFace : P9MagicCardGalleryItemStyle.backFace}
              sourceUri={image_uris?.large as string | undefined}
            />
          ))}
        </Animated.View>
      </Pressable>
    );
  },
  ({ magicCard: a }, { magicCard: b }) => a._id === b._id,
);

const P9MagicCardGalleryItemStyle = StyleSheet.create({
  container: {
    aspectRatio: 0.71794871794,
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
