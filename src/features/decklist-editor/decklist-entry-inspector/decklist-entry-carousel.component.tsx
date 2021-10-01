import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { ID } from '@datorama/akita';

import { usePower9Theme } from '../../../core/theme';
import { P9DecklistEditorEntry } from '../decklist-editor.model';
import { P9DecklistEntryCarouselItem } from './decklist-entry-carousel-item.component';

type CarouselRenderItem<TData> = (item: { item: TData; index: number }) => ReactElement;

export interface P9DecklistEntryCarouselProps {
  activeId?: ID;
  containerStyle?: StyleProp<ViewStyle>;
  editorEntries?: P9DecklistEditorEntry[];
  initialIndex?: number;
  magicCardImageContainerStyle?: StyleProp<ViewStyle>;
  magicCardImageStyle?: StyleProp<ImageStyle>;
  magicCardItemContainerStyle?: StyleProp<ViewStyle>;
  onEditorEntryChanged?(entryId?: string): void;
  onIndexChanged?(index: number): void;
  showPagination?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

export const P9DecklistEntryCarousel: FunctionComponent<P9DecklistEntryCarouselProps> = ({
  activeId,
  containerStyle,
  editorEntries = [],
  magicCardImageContainerStyle,
  magicCardItemContainerStyle,
  onEditorEntryChanged,
  onIndexChanged,
  showPagination = true,
}) => {
  const [{ colors }] = usePower9Theme();
  const initialIndex = useMemo(() => editorEntries.findIndex(({ id }) => id === activeId), [activeId, editorEntries]);
  const [currentIndex, setCurrentIndex] = useState<number>();

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (onEditorEntryChanged) {
        onEditorEntryChanged(editorEntries?.[index].id);
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
      <P9DecklistEntryCarouselItem
        magicCard={magicCard}
        magicCardImageContainerStyle={magicCardImageContainerStyle}
        magicCardItemContainerStyle={magicCardItemContainerStyle}
      />
    ),
    [magicCardImageContainerStyle, magicCardItemContainerStyle],
  );

  useEffect(() => onEditorEntryChanged?.(activeId as unknown as string), [activeId, onEditorEntryChanged]);

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
          activeDotIndex={currentIndex ?? initialIndex}
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

export const P9DecklistEntryEditorCarouselTheme = StyleSheet.create({
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
