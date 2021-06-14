import React, { FunctionComponent } from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  SectionListRenderItemInfo,
  StyleSheet,
} from 'react-native';

import { P9PickerPredicateExpression } from '../../features/magic-card-filter/model/predicate';
import { P9TableDivider } from '../divider/divider-table.component';
import { P9ViewSurface } from '../layout/surface.component';
import { P9ItemSeparator } from '../separator/item-separator.component';
import { P9PickerTableEmptyPlaceholder } from './picker-table-empty-placeholder';
import { P9PickerTableItem, P9PickerTableSelectionChange } from './picker-table-item';

const keyExtractor = (item: string, index: number): string => item + index;

const renderSectionHeader = ({ section }: Pick<SectionListRenderItemInfo<string, P9PickerTableSection>, 'section'>) => {
  return <P9TableDivider title={section.title} />;
};

export type P9PickerTableSection = {
  title: string;
  [key: string]: any;
};

export interface P9PickerTableProps {
  options: ReadonlyArray<SectionListData<string, P9PickerTableSection>>;
  selection?: P9PickerPredicateExpression;
  onSelection(event: P9PickerTableSelectionChange): void;
}

export const P9PickerTable: FunctionComponent<P9PickerTableProps> = ({ onSelection, options, selection }) => {
  // const handleSelect = useCallback(
  //   (tuple: P9PickerTableSelectionTuple) => {
  //     onSelection?.({ [value]: selected });
  //   },
  //   [onSelection],
  // );

  const renderItem: SectionListRenderItem<string, P9PickerTableSection> = ({ item }) => (
    <P9PickerTableItem
      title={item}
      onSelect={onSelection}
      selected={Boolean(selection?.[item]?.expression.selected)}
      value={item}
    />
  );

  if (options === undefined) {
    return <ActivityIndicator size={'large'} />;
  }

  return (
    <SectionList
      ItemSeparatorComponent={P9ItemSeparator}
      ListEmptyComponent={<P9PickerTableEmptyPlaceholder />}
      ListFooterComponent={<P9ViewSurface />}
      contentContainerStyle={P9PickerTableTheme.contentContainer}
      extraData={selection}
      initialNumToRender={30}
      keyboardDismissMode={'interactive'}
      keyboardShouldPersistTaps={'always'}
      keyExtractor={keyExtractor}
      removeClippedSubviews={false}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={options}
      windowSize={7}
    />
  );
};

export const P9PickerTableTheme = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});
