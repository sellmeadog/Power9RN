import React, { PropsWithChildren, useCallback } from 'react';
import { FlatList, FlatListProps, ListRenderItem } from 'react-native';

import { P9UserDecklist } from '../../../../core/data-user';
import { P9DecklistExplorerItem } from './decklist-explorer-item.component';

export interface P9DecklistExplorerSectionProps
  extends Omit<FlatListProps<P9UserDecklist>, 'keyExtractor' | 'renderItem'> {
  onLongPressItem(item: P9UserDecklist): void;
  onPressItem(id: string): void;
}

export function P9DecklistExplorerSection({
  data,
  onLongPressItem,
  onPressItem,
  ...rest
}: PropsWithChildren<P9DecklistExplorerSectionProps>) {
  const renderItem: ListRenderItem<P9UserDecklist> = useCallback(
    ({ item }) => <P9DecklistExplorerItem item={item} onPress={onPressItem} onLongPress={onLongPressItem} />,
    [onPressItem, onLongPressItem],
  );

  return <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} horizontal={true} {...rest} />;
}

function keyExtractor(item: P9UserDecklist): string {
  return item._id;
}
