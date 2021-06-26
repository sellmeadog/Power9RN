import React, { FunctionComponent, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { HashMap } from '@datorama/akita';

import {
  P9CarouselToggleButton,
  P9CarouselToggleOption,
  P9GameSymbolToggleButtonGroup,
  P9GameSymbolType,
  P9RowView,
} from '../../../../components';

export interface P9SymbolPickerPredicateBuilderProps {
  onOptionToggle?: (option: string) => void;
  onSymbolToggle: (option: string, symbol: P9GameSymbolType) => void;
  options: P9CarouselToggleOption<string>[];
  selection?: HashMap<boolean>;
  symbols: P9GameSymbolType[];
}

export const P9SymbolPickerPredicateBuilder: FunctionComponent<P9SymbolPickerPredicateBuilderProps> = ({
  onOptionToggle,
  onSymbolToggle,
  options,
  selection,
  symbols,
}) => {
  const [option, setOption] = useState<string>(options[0].value);

  const handleOptionToggle = useCallback(
    (value: string) => {
      setOption(value);
      onOptionToggle?.(value);
    },
    [onOptionToggle],
  );

  const handleSymbolToggle = useCallback(
    (symbol: P9GameSymbolType) => onSymbolToggle?.(option, symbol),
    [onSymbolToggle, option],
  );

  return (
    <>
      <P9RowView style={[P9SymbolPickerPredicateBuilderTheme.container]}>
        <P9CarouselToggleButton onToggle={handleOptionToggle} options={options} value={option} />
        <P9GameSymbolToggleButtonGroup onToggle={handleSymbolToggle} options={symbols} selection={selection} />
      </P9RowView>
    </>
  );
};

const P9SymbolPickerPredicateBuilderTheme = StyleSheet.create({
  container: {
    paddingRight: 10,
  },
});
