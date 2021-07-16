import React, { FunctionComponent, ReactElement, useCallback, useMemo, useState } from 'react';
import { Dimensions, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { ID } from '@datorama/akita';

import { usePower9Theme } from '../../../core/theme';
import { P9MagicCardImage } from '../../magic-cards';
import { P9DecklistEditorEntry } from '../decklist-editor-entry-explorer/decklist-editor-entry-explorer.component';

type CarouselRenderItem<TData> = (item: { item: TData; index: number }) => ReactElement;

export interface P9DecklistEditorEntryCarouselProps {
  activeId?: ID;
  containerStyle?: StyleProp<ViewStyle>;
  editorEntries?: P9DecklistEditorEntry[];
  initialIndex?: number;
  magicCardImageContainerStyle?: StyleProp<ViewStyle>;
  magicCardImageStyle?: StyleProp<ImageStyle>;
  magicCardItemContainerStyle?: StyleProp<ViewStyle>;
  onEditorEntryChanged?(magicCard?: P9DecklistEditorEntry): void;
  onIndexChanged?(index: number): void;
  showPagination?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

export const P9DecklistEntryEditorCarousel: FunctionComponent<P9DecklistEditorEntryCarouselProps> = ({
  activeId,
  containerStyle,
  magicCardImageContainerStyle,
  magicCardItemContainerStyle,
  editorEntries = [],
  onEditorEntryChanged,
  onIndexChanged,
  showPagination = true,
}) => {
  const [{ colors }] = usePower9Theme();
  const initialIndex = useMemo(() => editorEntries.findIndex(({ id }) => id === activeId), [activeId, editorEntries]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (onEditorEntryChanged) {
        onEditorEntryChanged(editorEntries ? editorEntries[index] : undefined);
      }

      if (onIndexChanged) {
        onIndexChanged(index);
      }

      setCurrentIndex(index);
    },
    [editorEntries, onEditorEntryChanged, onIndexChanged],
  );

  const renderItem: CarouselRenderItem<P9DecklistEditorEntry> = useCallback(
    ({ item: { magicCard } }) => (
      <P9MagicCardImage
        containerStyle={[P9DecklistEntryEditorCarouselTheme.magicCardItemContainer, magicCardItemContainerStyle]}
        imageContainerStyle={[P9DecklistEntryEditorCarouselTheme.magicCardImageContainer, magicCardImageContainerStyle]}
        sourceUri={magicCard?.card_faces[0].image_uris?.normal}
      />
    ),
    [magicCardImageContainerStyle, magicCardItemContainerStyle],
  );

  return (
    <View style={[P9DecklistEntryEditorCarouselTheme.container, containerStyle]}>
      <Carousel
        activeSlideAlignment={'center'}
        autoplay={true}
        autoplayDelay={3600000}
        containerCustomStyle={P9DecklistEntryEditorCarouselTheme.overflowContainer}
        data={editorEntries}
        enableSnap={true}
        firstItem={initialIndex}
        itemWidth={250}
        onSnapToItem={handleSnapToItem}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        vertical={false}
      />
      {showPagination && (
        <Pagination
          activeDotIndex={currentIndex}
          containerStyle={P9DecklistEntryEditorCarouselTheme.paginationContainer}
          dotColor={colors?.grey5}
          dotContainerStyle={P9DecklistEntryEditorCarouselTheme.dotContainer}
          dotsLength={editorEntries.length}
          inactiveDotColor={colors?.grey4}
        />
      )}
    </View>
  );
};

const P9DecklistEntryEditorCarouselTheme = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexShrink: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },

  overflowContainer: {
    overflow: 'visible',
  },

  dotContainer: {
    marginHorizontal: 2,
  },

  magicCardItemContainer: {
    overflow: 'visible',
  },

  magicCardImageContainer: {
    maxWidth: 250,
  },

  paginationContainer: {
    height: 44,
    paddingVertical: 0,
  },
});
