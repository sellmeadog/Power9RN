import React, { FunctionComponent } from 'react';
import { SectionListData, StyleSheet, View } from 'react-native';
import { Header } from 'react-native-elements';

import { useNavigation } from '@react-navigation/core';

import { P9PickerTable, P9PickerTableSection, P9PickerTableSelection } from '../picker-table/picker-table';
import { P9PickerTableSelectionChange } from '../picker-table/picker-table-item';
import { P9SearchBox } from '../search-box/search-box';

export interface P9PickerTableScreenTemplateProps {
  canFilter?: boolean;
  canReset?: boolean;
  expression?: string;
  onExpressionChange?(expression?: string): void;
  onReset(): void;
  onSelection(event: P9PickerTableSelectionChange): void;
  options: ReadonlyArray<SectionListData<string, P9PickerTableSection>>;
  selection?: P9PickerTableSelection;
  title: string;
}

export const P9PickerTableScreenTemplate: FunctionComponent<P9PickerTableScreenTemplateProps> = ({
  canFilter = true,
  canReset,
  expression,
  onExpressionChange,
  onReset,
  onSelection,
  options,
  selection,
  title,
}) => {
  const { goBack } = useNavigation();

  return (
    <>
      <Header
        centerComponent={{ text: title }}
        leftComponent={{ icon: 'arrow-back-ios', onPress: goBack }}
        rightComponent={canReset ? { text: 'Reset', onPress: onReset } : undefined}
      />
      {canFilter && (
        <View style={P9PickerTableScreenTheme.searchBoxContainer}>
          <P9SearchBox expression={expression} onExpressionChange={onExpressionChange} />
        </View>
      )}
      <P9PickerTable onSelection={onSelection} options={options} selection={selection} />
    </>
  );
};

const P9PickerTableScreenTheme = StyleSheet.create({
  searchBoxContainer: {
    height: 44,
    paddingHorizontal: 10,
  },
});
