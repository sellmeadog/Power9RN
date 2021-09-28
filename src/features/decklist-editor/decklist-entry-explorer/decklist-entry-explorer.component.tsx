import React, { FunctionComponent } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { P9ItemSeparator, P9TableDivider } from '../../../components';
import { P9DecklistEntryType } from '../../../core/data-user';
import { P9DecklistEditorEntry } from '../decklist-editor.model';
import { useDecklistEditorFacade } from '../state/decklist-editor.service';
import { P9DecklistEntryExplorerItem } from './decklist-entry-explorer-item.component';

export interface P9DecklistEntryExplorerProps {
  entryType: P9DecklistEntryType;
  onPress?(entry: P9DecklistEditorEntry): void;
}

export const P9DecklistEntryExplorer: FunctionComponent<P9DecklistEntryExplorerProps> = ({ entryType, onPress }) => {
  const [state] = useDecklistEditorFacade();

  return (
    <SectionList
      ItemSeparatorComponent={P9ItemSeparator}
      ListFooterComponent={<View style={P9DecklistEntryExplorerTheme.footerContainer} />}
      keyboardDismissMode={'interactive'}
      keyboardShouldPersistTaps={'always'}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <P9DecklistEntryExplorerItem entry={item} entryType={entryType} onPress={onPress} />}
      renderSectionHeader={({ section }) => <P9TableDivider title={`${section.title} (${section.size})`} />}
      sections={state[entryType] ?? []}
    />
  );
};

const P9DecklistEntryExplorerTheme = StyleSheet.create({
  footerContainer: {
    height: 54,
  },
});
