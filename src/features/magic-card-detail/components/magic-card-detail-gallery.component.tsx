import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Platform, ScrollViewProps, useWindowDimensions } from 'react-native';
import { Results } from 'realm';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

import { P9MagicCard } from '../../../core/public';
import { P9MagicCardDetailGalleryItem } from './magic-card-detail-gallery-item.component';

const KEYBOARD_DISMISS_MODE: 'on-drag' | 'interactive' | 'none' | undefined = Platform.select({
  android: 'on-drag',
  ios: 'interactive',
});

export interface P9MagicCardDetailGalleryProps {
  currentIndex?: number;
  data?: Results<P9MagicCard>;
  onCurrentIndexChange?(index: number): void;
}

export const P9MagicCardDetailGallery: FunctionComponent<P9MagicCardDetailGalleryProps> = ({
  currentIndex = 0,
  data,
}) => {
  const { height: HEIGHT, width: WIDTH } = useWindowDimensions();

  const [dataProvider, setDataProvider] = useState(
    () => new DataProvider((x: P9MagicCard, y: P9MagicCard) => x._id !== y._id),
  );

  const layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => 0,
        (_, dim) => {
          dim.width = WIDTH;
          dim.height = HEIGHT;
        },
      ),
    [HEIGHT, WIDTH],
  );

  useEffect(() => {
    if (data) {
      setDataProvider((d) => d.cloneWithRows(data as unknown as any[]));
    }
  }, [data]);

  // const handleVisibleIndicesChanged: TOnItemStatusChanged = useCallback((_, [index]) => onCurrentIndexChange?.(index), [
  //   onCurrentIndexChange,
  // ]);

  const scrollViewProps: ScrollViewProps = useMemo(
    () => ({
      decelerationRate: 'fast',
      disableIntervalMomentum: true,
      keyboardDismissMode: KEYBOARD_DISMISS_MODE,
      keyboardShouldPersistTaps: 'handled',
      showsHorizontalScrollIndicator: false,
      snapToAlignment: 'center',
      snapToInterval: WIDTH,
    }),
    [WIDTH],
  );

  if (data?.length) {
    return (
      <RecyclerListView
        dataProvider={dataProvider}
        initialRenderIndex={currentIndex}
        isHorizontal={true}
        layoutProvider={layoutProvider}
        rowRenderer={renderItem}
        scrollViewProps={scrollViewProps}
        style={{ width: WIDTH, height: HEIGHT }}
        // onVisibleIndicesChanged={handleVisibleIndicesChanged}
      />
    );
  }

  return null;
};

function renderItem(_: string | number, item: P9MagicCard) {
  return (
    <P9MagicCardDetailGalleryItem
      magicCard={item}
      // id={_id}
      // card_faces={card_faces}
      // collector_number={collector_number}
      // magic_set={magic_set}
      // rarity={rarity}
      // rulings_uri={rulings_uri}
      // legalities={legalities}
      // name={name}
      // artist={card_faces.map(({ artist }) => artist).join(' // ')}
    />
  );
}
