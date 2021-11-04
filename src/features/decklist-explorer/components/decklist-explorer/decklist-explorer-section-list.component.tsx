import React, { PropsWithChildren, useCallback } from 'react';
import { SectionList, SectionListData, SectionListProps, SectionListRenderItem, StyleSheet } from 'react-native';

import { P9TableDivider, P9ViewSurface } from '../../../../components';
import { P9UserDecklist } from '../../../../core/data-user';
import { useUserDecklistActions } from '../decklist-explorer-screen-home/screen-home/screen-home.facade';
import { P9DecklistExplorerSection } from './decklist-explorer-section.component';

export interface P9DecklistExplorerSectionListProps
  extends Omit<SectionListProps<P9UserDecklist[]>, 'renderItem' | 'renderSectionHeader'> {}

export function P9DecklistExplorerSectionList({
  sections,
  ...rest
}: PropsWithChildren<P9DecklistExplorerSectionListProps>) {
  const [_, __, ___, activateSection] = useUserDecklistActions();

  const renderItem: SectionListRenderItem<P9UserDecklist[]> = useCallback(
    ({ item }) => <P9DecklistExplorerSection data={item} />,
    [],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<P9UserDecklist[]> }) => {
      const count = section.data[0].length;
      const actionText = count === 1 ? '1 Deck' : `${count} Decks`;

      return (
        <P9TableDivider
          actionText={actionText}
          actionVisible
          containerStyle={[P9DecklistExplorerTheme.dividerContainer]}
          title={section.title}
          actionHandler={() => activateSection(section.formatId)}
        />
      );
    },
    [activateSection],
  );

  return (
    <SectionList
      {...rest}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      ListFooterComponent={<P9ViewSurface edges={['bottom']} />}
    />
  );
}

export function keyExtractor(_: P9UserDecklist[], index: number): string {
  return index.toString();
}

const P9DecklistExplorerTheme = StyleSheet.create({
  dividerContainer: {
    paddingRight: 0,
  },
});
