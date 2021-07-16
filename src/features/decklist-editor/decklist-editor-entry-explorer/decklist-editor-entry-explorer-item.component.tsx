import React, { FunctionComponent, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import { P9RowView, P9TableViewItem } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9MagicCardArtwork } from '../../magic-cards';
import { P9DecklistEditorEntry } from './decklist-editor-entry-explorer.component';

export interface P9DecklistEditorEntryExplorerItemProps {
  entry: P9DecklistEditorEntry;
  entryType: P9DecklistEntryType;
  onPress?(entry: P9DecklistEditorEntry): void;
}

export const P9DecklistEditorEntryExplorerItem: FunctionComponent<P9DecklistEditorEntryExplorerItemProps> = ({
  entry,
  entryType,
  onPress,
}) => {
  const handlePress = useCallback(() => onPress?.(entry), [entry, onPress]);

  return (
    <P9TableViewItem containerStyle={P9DecklistEditorEntryExplorerItemTheme.itemContainer} onPress={handlePress}>
      <P9RowView style={P9DecklistEditorEntryExplorerItemTheme.rowContainer}>
        <FastImage
          source={{ uri: entry.magicCard?.card_faces[0].image_uris?.art_crop }}
          style={P9DecklistEditorEntryExplorerItemTheme.imageContainer}
        />
        <Text>{`${entry?.[entryType]}x `}</Text>
        <View>
          <Text>{entry?.magicCard?.name}</Text>
          <Text>{entry?.magicCard?.card_faces[0].type_line}</Text>
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
  },
});
