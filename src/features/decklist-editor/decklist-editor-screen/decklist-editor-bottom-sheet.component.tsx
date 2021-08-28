import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetHandleProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import { P9MagicCard } from '../../../core/public';
import { usePower9Theme } from '../../../core/theme';
import { P9MagicCardGallery, P9MagicCardSearchBar } from '../../magic-cards';
import { useMagicCardGalleryFacade } from '../../public/components';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';

export interface P9DecklistEditorBottomSheetProps {}

export const P9DecklistEditorBottomSheet: FunctionComponent<P9DecklistEditorBottomSheetProps> = () => {
  const [{ activeEntryType = 'maindeck' }, __, upsertEntry] = useDecklistEditorFacade();
  const [{ visibleResults }] = useMagicCardGalleryFacade();
  const { bottom, top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const snapPoints = useMemo(() => [3 + bottom, height - 120], [bottom, height]);

  const handleEntryPress = useCallback(
    (magicCard: P9MagicCard) => upsertEntry(magicCard, activeEntryType),
    [activeEntryType, upsertEntry],
  );

  const animatedIndex = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animatedIndex.value, { duration: 500, easing: Easing.out(exp) }),
    transform: [{ translateY: interpolate(animatedIndex.value, [0, 1], [100, 0], Extrapolate.CLAMP) }],
    flexGrow: 1,
  }));

  return (
    <BottomSheet
      animatedIndex={animatedIndex}
      backgroundComponent={P9DecklistEditorBottomSheetBackground}
      handleComponent={P9DecklistEditorBottomSheetHandle}
      keyboardBehavior={'extend'}
      snapPoints={snapPoints}
      topInset={top}
    >
      <Animated.View style={[animatedStyle]}>
        <P9MagicCardGallery data={visibleResults} onPress={handleEntryPress} />
      </Animated.View>
    </BottomSheet>
  );
};

export interface P9DecklistEditorBottomSheetHandleProps extends BottomSheetHandleProps {}

export const P9DecklistEditorBottomSheetHandle: FunctionComponent<P9DecklistEditorBottomSheetHandleProps> = () => {
  const [{ activeEntryType = 'maindeck' }] = useDecklistEditorFacade();
  return (
    <P9MagicCardSearchBar
      containerStyle={P9DecklistEditorBottomSheetTheme.handleContainer}
      searchBoxProps={{
        borderContainerStyle: [{ height: 34 }],
        InputComponent: BottomSheetTextInput,
        placeholder: `Add cards to ${activeEntryType}`,
      }}
    />
  );
};

export interface P9DecklistEditorBottomSheetBackgroundProps extends BottomSheetBackgroundProps {}

export const P9DecklistEditorBottomSheetBackground: FunctionComponent<P9DecklistEditorBottomSheetBackgroundProps> = ({
  animatedIndex,
  style,
}) => {
  const [{ colors }] = usePower9Theme();
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedIndex.value, [0, 1], [colors!.grey2!, colors!.grey2!]),
  }));

  return (
    <Animated.View
      pointerEvents={'none'}
      style={[animatedStyle, P9DecklistEditorBottomSheetTheme.backgroundContainer, style]}
    />
  );
};

const P9DecklistEditorBottomSheetTheme = StyleSheet.create({
  backgroundContainer: {
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  handleContainer: { paddingLeft: 5, paddingRight: 10, paddingTop: 5 },
});

export const exp = (t: number) => {
  'worklet';
  return Math.min(Math.max(0, Math.pow(2, 10 * (t - 1))), 1);
};
