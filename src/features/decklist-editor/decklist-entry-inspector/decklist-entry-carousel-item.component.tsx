import React, { FunctionComponent } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { P9MagicCard } from '../../../core/public';
import { P9MagicCardImage } from '../../magic-cards';
import { P9DecklistEntryEditorCarouselTheme } from './decklist-entry-carousel.component';

export interface P9DecklistEntryCarouselItemProps {
  magicCard?: P9MagicCard;
  magicCardImageContainerStyle?: StyleProp<ViewStyle>;
  magicCardItemContainerStyle?: StyleProp<ViewStyle>;
}

export const P9DecklistEntryCarouselItem: FunctionComponent<P9DecklistEntryCarouselItemProps> = ({
  magicCard,
  magicCardImageContainerStyle,
  magicCardItemContainerStyle,
}) => {
  return (
    <P9MagicCardImage
      containerStyle={[P9DecklistEntryEditorCarouselTheme.magicCardItemContainer, magicCardItemContainerStyle]}
      imageContainerStyle={[P9DecklistEntryEditorCarouselTheme.magicCardImageContainer, magicCardImageContainerStyle]}
      sourceUri={magicCard?.card_faces[0].image_uris?.normal ?? undefined}
    />
  );
};
