import React, { FunctionComponent, useCallback } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { P9RowView, P9TableViewItem } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9MagicCardArtwork, P9MagicCardText } from '../../magic-cards';
import { P9DecklistEditorEntry } from './decklist-entry-explorer.component';

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
    <P9TableViewItem containerStyle={P9DecklistEditorEntryExplorerItemTheme.itemContainer} onPress={handlePress}>
      <P9RowView style={P9DecklistEditorEntryExplorerItemTheme.rowContainer}>
        <ImageBackground
          source={{ uri: entry.magicCard?.card_faces[0].image_uris?.art_crop }}
          style={P9DecklistEditorEntryExplorerItemTheme.imageContainer}
        >
          <Text
            style={[P9DecklistEditorEntryExplorerItemTheme.title, P9DecklistEditorEntryExplorerItemTheme.count]}
          >{`${entry?.[entryType]}x `}</Text>
        </ImageBackground>
        <View style={P9DecklistEditorEntryExplorerItemTheme.contentContainer}>
          <View style={P9DecklistEditorEntryExplorerItemTheme.titleContainer}>
            <Text style={[P9DecklistEditorEntryExplorerItemTheme.title]}>{entry?.magicCard?.name}</Text>
            <Text style={[P9DecklistEditorEntryExplorerItemTheme.title]}>
              <P9MagicCardText>{entry.magicCard?.card_faces[0].mana_cost}</P9MagicCardText>
            </Text>
          </View>
          <Text style={[P9DecklistEditorEntryExplorerItemTheme.typeLine]}>
            {entry?.magicCard?.card_faces[0].type_line}
          </Text>
        </View>
      </P9RowView>
    </P9TableViewItem>
  );
};

const P9DecklistEditorEntryExplorerItemTheme = StyleSheet.create({
  itemContainer: {
    paddingVertical: 10,
  },

  rowContainer: {
    alignItems: 'flex-start',
  },

  imageContainer: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    height: 44,
    justifyContent: 'center',
  },

  contentContainer: {
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: 10,
  },

  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  title: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 17,
  },

  typeLine: {
    fontSize: 15,
  },
});
