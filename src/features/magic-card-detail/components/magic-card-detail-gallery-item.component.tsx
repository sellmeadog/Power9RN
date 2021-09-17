import React, { FunctionComponent, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { P9MagicCard } from '../../../core/public';
import { usePower9Theme } from '../../../core/theme';
import { P9MagicCardArtwork, P9MagicCardImage, P9MagicCardPrintingIndicator } from '../../magic-cards';
import { P9MagicCardDetailFooter } from './magic-card-detail-footer';
import { P9MagicCardDetailHeader } from './magic-card-detail-header';
import { P9MagicCardDetailLegality } from './magic-card-detail-legality';
import { P9MagicCardDetailOracleText } from './magic-card-detail-oracle-text';
import { P9MagicCardDetailParallaxBackground } from './magic-card-detail-parallax-background';
import { P9MagicCardDetailParallaxForeground } from './magic-card-detail-parallax-foreground';
import { P9MagicCardDetailPricing } from './magic-card-detail-pricing';
import { P9MagicCardDetailRuling } from './magic-card-detail-rulings';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = getStatusBarHeight();

export interface P9MagicCardDetailGalleryItemProps {
  magicCard: P9MagicCard;
}

export const P9MagicCardDetailGalleryItem: FunctionComponent<P9MagicCardDetailGalleryItemProps> = ({ magicCard }) => {
  const { card_faces, collector_number, _id, legalities, magic_set, name, rarity, rulings_uri } = magicCard;
  const [{ colors }] = usePower9Theme();

  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y;
  });

  const contentOffset = useMemo(() => (width - 95) / P9MagicCardImage.ASPECT_RATIO, []);
  const scrollOffset = useMemo(() => (width - 80) / P9MagicCardImage.ASPECT_RATIO - STATUS_BAR_HEIGHT, []);

  return (
    <View style={[P9MagicCardDetailTheme.parallaxContainer]}>
      <P9MagicCardDetailParallaxBackground
        scrollOffset={scrollOffset}
        scrollY={scrollY}
        sourceUri={card_faces[0].image_uris?.art_crop ?? ''}
      />
      <P9MagicCardDetailParallaxForeground
        scrollOffset={scrollOffset}
        scrollY={scrollY}
        sourceUri={card_faces[0].image_uris?.normal ?? ''}
      />
      <P9MagicCardDetailHeader scrollOffset={scrollOffset} scrollY={scrollY} title={name} />
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={{ height: contentOffset }}>
          <View style={P9MagicCardDetailTheme.parallaxForegroundOffsetContainer} />
          <View
            style={[{ backgroundColor: colors?.grey1 }, P9MagicCardDetailTheme.parallaxForegroundSurfaceContainer]}
          />
        </View>
        <P9MagicCardPrintingIndicator collector_number={collector_number} magic_set={magic_set} rarity={rarity} />
        <P9MagicCardDetailPricing id={_id} />
        <P9MagicCardDetailOracleText card_faces={card_faces} />
        <P9MagicCardDetailLegality legalities={legalities} />
        <P9MagicCardDetailRuling rulings_uri={rulings_uri} />
        <P9MagicCardDetailFooter magicCard={magicCard} />
      </Animated.ScrollView>
    </View>
  );
};

const P9MagicCardDetailTheme = StyleSheet.create({
  parallaxContainer: {
    flex: 1,
    width,
  },

  parallaxForegroundContainer: {
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 40,
  },

  parallaxForegroundImageContainer: {
    borderRadius: 18,
  },

  parallaxForegroundOffsetContainer: {
    height: width / P9MagicCardArtwork.ASPECT_RATIO - STATUS_BAR_HEIGHT - 44,
  },

  parallaxForegroundSurfaceContainer: {
    flex: 1,
  },
});
