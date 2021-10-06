import React, { FunctionComponent, useCallback } from 'react';
import { FlatList, ListRenderItem, Platform, useWindowDimensions } from 'react-native';
import { Results } from 'realm';

import { P9MagicCardObject } from '../../../core/public';
import { P9MagicCardDetailGalleryItem } from './magic-card-detail-gallery-item.component';

type ListGetItemLayout<ItemT> = (
  data: Array<ItemT> | null | undefined,
  index: number,
) => { length: number; offset: number; index: number };

type ListKeyExtractor<ItemT> = ((item: ItemT, index: number) => string) | undefined;

const KEYBOARD_DISMISS_MODE: 'on-drag' | 'interactive' | 'none' | undefined = Platform.select({
  android: 'on-drag',
  ios: 'interactive',
});

export interface P9MagicCardDetailFlatListProps {
  current?: number;
  data?: Results<P9MagicCardObject>;
}

export const P9MagicCardDetailFlatList: FunctionComponent<P9MagicCardDetailFlatListProps> = ({
  current = 0,
  data = [],
}) => {
  const { width } = useWindowDimensions();

  const getItemLayout = useCallback<ListGetItemLayout<P9MagicCardObject>>(
    (_, index) => ({ length: width, offset: index * width, index }),
    [width],
  );

  return (
    <FlatList
      data={data}
      decelerationRate={'fast'}
      disableIntervalMomentum={true}
      getItemLayout={getItemLayout}
      horizontal={true}
      initialNumToRender={1}
      initialScrollIndex={current}
      keyboardDismissMode={KEYBOARD_DISMISS_MODE}
      keyboardShouldPersistTaps={'handled'}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={5}
      removeClippedSubviews={false}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      snapToAlignment={'center'}
      snapToInterval={width}
      windowSize={5}
    />
  );
};

const keyExtractor: ListKeyExtractor<P9MagicCardObject> = ({ _id }) => _id;

const renderItem: ListRenderItem<P9MagicCardObject> = ({ item }) => <P9MagicCardDetailGalleryItem magicCard={item} />;
