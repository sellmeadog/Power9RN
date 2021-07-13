import React, { FunctionComponent } from 'react';
import { Text } from 'react-native-elements';

import { P9FlatList } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';

export interface P9DecklistEditorEntryExplorerProps {
  entryType: P9DecklistEntryType;
}

export const P9DecklistEditorEntryExplorer: FunctionComponent<P9DecklistEditorEntryExplorerProps> = () => {
  const [{ entries }] = useDecklistEditorFacade();

  return (
    <P9FlatList
      data={entries ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{`${item.id} (${item.maindeck})`}</Text>}
    />
  );
};

// const P9DecklistEditorEntryExplorerTheme = StyleSheet.create({});
