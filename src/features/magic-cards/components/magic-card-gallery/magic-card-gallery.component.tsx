import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollViewProps, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Results } from 'realm';
import { LayoutProvider, RecyclerListView } from 'recyclerlistview';

import { P9MagicCard } from '../../../../core/public';
import { ResultsDataProvider } from '../../../../core/realm/results-data-provider';
import { P9MagicCardGalleryItem } from './magic-card-gallery-item.component';

const { width: WIDTH } = Dimensions.get('screen');

export interface P9MagicCardGalleryProps {
  currentIndex?: number;
  data: Results<P9MagicCard & Realm.Object> | undefined;
  onPress?(magicCard: P9MagicCard, index: number): void;
}

export const P9MagicCardGallery: FunctionComponent<P9MagicCardGalleryProps> = ({ currentIndex, data, onPress }) => {
  const [dataProvider, setDataProvider] = useState(
    () => new ResultsDataProvider((x: P9MagicCard & Realm.Object, y: P9MagicCard & Realm.Object) => x._id !== y._id),
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
    setDataProvider((d) => d.cloneWithRows((data || []) as unknown as Array<P9MagicCard & Realm.Object>));
  }, [data]);

  const renderItem = useCallback(
    (_: string | number, item: P9MagicCard, index: number) => (
      <P9MagicCardGalleryItem index={index} magicCard={item} onPress={onPress} />
    ),
    [onPress],
  );

  const rlvRef = useRef<RecyclerListView<any, any>>(null);

  useEffect(() => {
    if (currentIndex !== undefined) {
      rlvRef.current?.scrollToIndex(currentIndex);
    }
  }, [currentIndex]);

  const { bottom } = useSafeAreaInsets();

  if (dataProvider.getSize()) {
    return (
      <RecyclerListView
        ref={rlvRef}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={renderItem}
        style={P9MagicCardGalleryTheme.container}
        scrollViewProps={
          {
            contentContainerStyle: { paddingBottom: bottom || 10 },
            keyboardDismissMode: Platform.select({ android: 'on-drag', ios: 'interactive' }),
            keyboardShouldPersistTaps: 'handled',
          } as ScrollViewProps
        }
      />
    );
  }

  return <View style={P9MagicCardGalleryTheme.container} />;
};

const P9MagicCardGalleryTheme = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
