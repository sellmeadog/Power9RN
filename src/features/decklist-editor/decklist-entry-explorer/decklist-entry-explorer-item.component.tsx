import React, { FunctionComponent, useCallback } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { P9RowView, P9TableViewItem } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9MagicCardArtwork, P9MagicCardText } from '../../magic-cards';
import { P9DecklistEditorEntry } from '../decklist-editor.model';

export interface P9DecklistEntryExplorerItemProps {
  entry: P9DecklistEditorEntry;
  entryType: P9DecklistEntryType;
  onPress?(entry: P9DecklistEditorEntry): void;
}

export const P9DecklistEntryExplorerItem: FunctionComponent<P9DecklistEntryExplorerItemProps> = ({
  entry,
  entryType,
  onPress,
}) => {
  const handlePress = useCallback(() => onPress?.(entry), [entry, onPress]);

  return (
    <P9TableViewItem containerStyle={P9DecklistEntryExplorerItemTheme.itemContainer} onPress={handlePress}>
      <P9RowView style={P9DecklistEntryExplorerItemTheme.rowContainer}>
        <ImageBackground
          source={{ uri: entry.magicCard?.card_faces[0].image_uris?.art_crop }}
          style={P9DecklistEntryExplorerItemTheme.imageContainer}
        >
          <Text
            style={[P9DecklistEntryExplorerItemTheme.title, P9DecklistEntryExplorerItemTheme.count]}
          >{`${entry?.[entryType]}x `}</Text>
        </ImageBackground>
        <View style={P9DecklistEntryExplorerItemTheme.contentContainer}>
          <View style={P9DecklistEntryExplorerItemTheme.titleContainer}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={[P9DecklistEntryExplorerItemTheme.title]}>
              {entry?.magicCard?.name}
            </Text>
            <View style={P9DecklistEntryExplorerItemTheme.titleSymbolContainer}>
              <P9MagicCardText gameSymbolStyle={[P9DecklistEntryExplorerItemTheme.titleSymbol]}>
                {entry.magicCard?.card_faces[0].mana_cost}
              </P9MagicCardText>
            </View>
          </View>
          <Text style={[P9DecklistEntryExplorerItemTheme.typeLine]}>{entry?.magicCard?.card_faces[0].type_line}</Text>
        </View>
      </P9RowView>
    </P9TableViewItem>
  );
};

const P9DecklistEntryExplorerItemTheme = StyleSheet.create({
  itemContainer: {
    paddingVertical: 10,
    flexShrink: 1,
  },

  rowContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },

  imageContainer: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    height: 44,
    justifyContent: 'center',
  },

  contentContainer: {
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },

  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },

  titleSymbolContainer: {
    alignItems: 'flex-end',
    flexGrow: 1,
    flexWrap: 'nowrap',
    justifyContent: 'center',
    marginLeft: 10,
    paddingTop: 5,
  },

  titleSymbol: {
    marginRight: 0,
    marginLeft: 2,
  },

  title: {
    flexShrink: 1,
    fontFamily: 'Beleren2016-Bold',
    fontSize: 17,
  },

  typeLine: {
    fontSize: 15,
  },

  count: {
    alignSelf: 'flex-end',
    fontSize: 22,
    textShadowColor: '#000',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2.22,

    elevation: 3,
  },
});
