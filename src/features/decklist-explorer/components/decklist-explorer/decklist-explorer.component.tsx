import React, { PropsWithChildren, useCallback } from 'react';
import { SectionList, SectionListData, SectionListProps, SectionListRenderItem } from 'react-native';

import { P9TableDivider, P9ViewSurface } from '../../../../components';
import { P9UserDecklist } from '../../../../core/data-user';
import { P9DecklistExplorerSection } from './decklist-explorer-section.component';

export interface P9DecklistExplorerProps
  extends Omit<SectionListProps<P9UserDecklist[]>, 'renderItem' | 'renderSectionHeader'> {
  onActivate(id: string): void;
  onLongPress(item: P9UserDecklist): void;
}

export function P9DecklistExplorer({
  sections,
  onActivate,
  onLongPress,
  ...rest
}: PropsWithChildren<P9DecklistExplorerProps>) {
  const renderItem: SectionListRenderItem<P9UserDecklist[]> = useCallback(
    ({ item }) => <P9DecklistExplorerSection data={item} onPressItem={onActivate} onLongPressItem={onLongPress} />,
    [onActivate, onLongPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<P9UserDecklist[]> }) => <P9TableDivider title={section.title} />,
    [],
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

function keyExtractor(_: P9UserDecklist[], index: number): string {
  return index.toString();
}
