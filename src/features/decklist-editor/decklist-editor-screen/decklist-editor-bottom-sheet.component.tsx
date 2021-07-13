import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
  BottomSheetHandleProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import { usePower9Theme } from '../../../core/theme';
import { P9MagicCardGallery, P9MagicCardImage, P9MagicCardSearchBar } from '../../magic-cards';
import { useMagicCardGalleryFacade } from '../../public/components';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';

export interface P9DecklistEditorBottomSheetProps {}

export const P9DecklistEditorBottomSheet: FunctionComponent<P9DecklistEditorBottomSheetProps> = () => {
  const [{ visibleResults }] = useMagicCardGalleryFacade();
  const [_, __, addCard] = useDecklistEditorFacade();

  return (
    <BottomSheet
      backgroundComponent={P9DecklistEditorBottomSheetBackground}
      handleComponent={P9DecklistEditorBottomSheetHandle}
      keyboardBehavior={'interactive'}
      snapPoints={[76, 300]}
    >
      {/* <BottomSheetFlatList
        data={visibleResults}
        horizontal={true}
        keyExtractor={({ _id }) => _id}
        renderItem={({ item }) => <P9MagicCardImage sourceUri={item.card_faces[0].image_uris?.small} />}
      /> */}
      <P9MagicCardGallery data={visibleResults} onPress={(___, id) => addCard(id)} />
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
