import React, { FunctionComponent, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { usePower9Theme } from '../../../core/theme';
import {
  P9MagicCardArtwork,
  P9MagicCardImage,
  P9MagicCardPrintingPickerSheet,
  P9MagicCardPrintingPickerToggle,
  useMagicCardPrinting,
} from '../../magic-cards';
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

export interface P9MagicCardDetailTableProps {}

export const P9MagicCardDetailTable: FunctionComponent<P9MagicCardDetailTableProps> = () => {
  const printing = useMagicCardPrinting();
  const [{ colors }] = usePower9Theme();

  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollY.value = contentOffset.y;
  });

  const contentOffset = useMemo(() => (width - 95) / P9MagicCardImage.ASPECT_RATIO, []);
  const scrollOffset = useMemo(() => (width - 80) / P9MagicCardImage.ASPECT_RATIO - STATUS_BAR_HEIGHT, []);

  return (
    <View style={[P9MagicCardDetailTableTheme.parallaxContainer]}>
      <P9MagicCardDetailParallaxBackground
        scrollOffset={scrollOffset}
        scrollY={scrollY}
        sourceUri={printing?.card_faces[0].image_uris?.art_crop ?? undefined}
      />
      <P9MagicCardDetailParallaxForeground
        scrollOffset={scrollOffset}
        scrollY={scrollY}
        sourceUri={printing?.card_faces[0].image_uris?.normal ?? undefined}
      />
      <P9MagicCardDetailHeader scrollOffset={scrollOffset} scrollY={scrollY} title={printing?.name} />
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={{ height: contentOffset }}>
          <View style={P9MagicCardDetailTableTheme.parallaxForegroundOffsetContainer} />
          <View
            style={[{ backgroundColor: colors?.grey1 }, P9MagicCardDetailTableTheme.parallaxForegroundSurfaceContainer]}
          />
        </View>
        <P9MagicCardPrintingPickerToggle />
        <P9MagicCardDetailPricing id={printing?._id} />
        <P9MagicCardDetailOracleText card_faces={printing?.card_faces} />
        <P9MagicCardDetailLegality legalities={printing?.legalities} />
        <P9MagicCardDetailRuling rulings_uri={printing?.rulings_uri} />
        <P9MagicCardDetailFooter magicCard={printing} />
      </Animated.ScrollView>
      <P9MagicCardPrintingPickerSheet />
    </View>
  );
};

const P9MagicCardDetailTableTheme = StyleSheet.create({
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

  pickerContainer: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
    height: undefined,
    marginBottom: 0,
    minHeight: 44,
    paddingBottom: 16,
    paddingHorizontal: 40,
    paddingTop: 10,
  },
});
