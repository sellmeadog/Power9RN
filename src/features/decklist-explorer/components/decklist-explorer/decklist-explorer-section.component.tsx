import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { FlatList, FlatListProps, ListRenderItem, useWindowDimensions } from 'react-native';

import { P9UserDecklist } from '../../../../core/data-user';
import { useUserDecklistActions } from '../decklist-explorer-screen-home/screen-home/screen-home.facade';
import { P9DecklistExplorerItem } from './decklist-explorer-item.component';

export interface P9DecklistExplorerSectionProps
  extends Omit<FlatListProps<P9UserDecklist>, 'keyExtractor' | 'renderItem'> {}

export function P9DecklistExplorerSection({
  data,
  horizontal = true,
  ...rest
}: PropsWithChildren<P9DecklistExplorerSectionProps>) {
  const { width } = useWindowDimensions();
  const itemWidth = useMemo(() => (horizontal ? 250 : width - 20), [horizontal, width]);
  const [handlePress, _, handleLongPress] = useUserDecklistActions();

  const renderItem: ListRenderItem<P9UserDecklist> = useCallback(
    ({ item }) => (
      <P9DecklistExplorerItem item={item} onPress={handlePress} onLongPress={handleLongPress} width={itemWidth} />
    ),
    [handleLongPress, handlePress, itemWidth],
  );

  return <FlatList data={data} keyExtractor={keyExtractor} renderItem={renderItem} horizontal={horizontal} {...rest} />;
}

function keyExtractor(item: P9UserDecklist): string {
  return item._id;
}
