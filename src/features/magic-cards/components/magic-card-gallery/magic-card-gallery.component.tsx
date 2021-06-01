import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Results } from 'realm';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';

import { P9MagicCard } from '../../../../core/public';
import { ResultsDataProvider } from '../../../../core/realm/results-data-provider';
import { P9MagicCardGalleryItem } from './magic-card-gallery-item.component';

const { width: WIDTH } = Dimensions.get('screen');

export interface P9MagicCardGalleryProps {
  currentIndex?: number;
  data: Results<P9MagicCard> | undefined;
  onPress?(index: number): void;
}

export const P9MagicCardGallery: FunctionComponent<P9MagicCardGalleryProps> = ({ currentIndex, data, onPress }) => {
  const [dataProvider, setDataProvider] = useState(
    () => new ResultsDataProvider((x: P9MagicCard, y: P9MagicCard) => x._id !== y._id),
  );

  const layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => 0,
        (_, dim) => {
          dim.width = WIDTH / 2 - 5;
          dim.height = dim.width / 0.71794871794;
        },
      ),
    [],
  );

  useEffect(() => {
    setDataProvider((d) => d.cloneWithRows((data || []) as unknown as any[]));
  }, [data]);

  const renderItem = useCallback(
    (_: string | number, item: P9MagicCard, index: number) => (
      <P9MagicCardGalleryItem booster={item.booster} card_faces={item.card_faces} index={index} onPress={onPress} />
    ),
    [onPress],
  );

  const rlvRef = useRef<RecyclerListView<any, any>>(null);

  useEffect(() => {
    if (currentIndex !== undefined) {
      rlvRef.current?.scrollToIndex(currentIndex);
    }
  }, [currentIndex]);

  if (dataProvider.getSize()) {
    return (
      <RecyclerListView
        ref={rlvRef}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={renderItem}
        style={P9MagicCardGalleryTheme.container}
        scrollViewProps={{
          keyboardDismissMode: Platform.select({ android: 'on-drag', ios: 'interactive' }),
          keyboardShouldPersistTaps: 'handled',
        }}
      />
    );
  }

  return null;
};

const P9MagicCardGalleryTheme = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingTop: 10,
  },
});
