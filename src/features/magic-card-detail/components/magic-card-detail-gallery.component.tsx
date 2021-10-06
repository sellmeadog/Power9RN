import React, { FunctionComponent } from 'react';
// import { Platform, ScrollViewProps, useWindowDimensions } from 'react-native';
import { Results } from 'realm';

// import { LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { P9MagicCardObject } from '../../../core/public';
import { ResultsDataProvider } from '../../../core/realm/results-data-provider';
import { P9MagicCardDetailFlatList } from './magic-card-detail-flat-list.component';

// import { P9MagicCardDetailGalleryItem } from './magic-card-detail-gallery-item.component';

// const KEYBOARD_DISMISS_MODE: 'on-drag' | 'interactive' | 'none' | undefined = Platform.select({
//   android: 'on-drag',
//   ios: 'interactive',
// });

export interface P9MagicCardDetailGalleryProps {
  currentIndex?: number;
  data?: Results<P9MagicCardObject>;
  dataProvider?: ResultsDataProvider<P9MagicCardObject>;
  onCurrentIndexChange?(index: number): void;
}

export const P9MagicCardDetailGallery: FunctionComponent<P9MagicCardDetailGalleryProps> = ({
  currentIndex = 0,
  data,
}) => {
  // const { height: HEIGHT, width: WIDTH } = useWindowDimensions();

  // const layoutProvider = useMemo(
  //   () =>
  //     new LayoutProvider(
  //       () => 0,
  //       (_, dim) => {
  //         dim.width = WIDTH;
  //         dim.height = HEIGHT;
  //       },
  //     ),
  //   [HEIGHT, WIDTH],
  // );

  // const handleVisibleIndicesChanged: TOnItemStatusChanged = useCallback((_, [index]) => onCurrentIndexChange?.(index), [
  //   onCurrentIndexChange,
  // ]);

  // const scrollViewProps: ScrollViewProps = useMemo(
  //   () => ({
  //     decelerationRate: 'fast',
  //     disableIntervalMomentum: true,
  //     keyboardDismissMode: KEYBOARD_DISMISS_MODE,
  //     keyboardShouldPersistTaps: 'handled',
  //     showsHorizontalScrollIndicator: false,
  //     snapToAlignment: 'center',
  //     snapToInterval: WIDTH,
  //   }),
  //   [WIDTH],
  // );

  // if (dataProvider.getSize()) {
  //   return (
  //     <RecyclerListView
  //       dataProvider={dataProvider}
  //       initialRenderIndex={currentIndex}
  //       isHorizontal={true}
  //       layoutProvider={layoutProvider}
  //       rowRenderer={renderItem}
  //       scrollViewProps={scrollViewProps}
  //       disableRecycling={true}
  //       style={{ width: WIDTH, height: HEIGHT }}
  //       // onVisibleIndicesChanged={handleVisibleIndicesChanged}
  //     />
  //   );
  // }

  // return null;
  return <P9MagicCardDetailFlatList current={currentIndex} data={data} />;
};

// function renderItem(_: string | number, item: P9MagicCard) {
//   return <P9MagicCardDetailGalleryItem magicCard={item} />;
// }
