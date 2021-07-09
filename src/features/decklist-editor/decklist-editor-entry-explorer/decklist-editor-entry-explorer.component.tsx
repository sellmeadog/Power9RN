import React, { FunctionComponent } from 'react';
// import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import { P9FlatList } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9DecklistEditorEntry } from '../decklist-editor.model';

export interface P9DecklistEditorEntryExplorerProps {
  entryType: P9DecklistEntryType;
}

export const P9DecklistEditorEntryExplorer: FunctionComponent<P9DecklistEditorEntryExplorerProps> = () => {
  return (
    <P9FlatList
      data={[] as P9DecklistEditorEntry[]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.magicCard?.name}</Text>}
    />
  );
};

// const P9DecklistEditorEntryExplorerTheme = StyleSheet.create({});
