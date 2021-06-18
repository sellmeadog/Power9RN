import React, { FunctionComponent, useCallback, useState } from 'react';

import { P9CarouselToggleButton, P9CarouselToggleOption, P9GameSymbolType, P9RowView } from '../../../../components';
import { P9ColorPredicateExpression } from '../../model/predicate';
import { P9ColorPredicateSymbolToggleGroup } from '../predicate-builder-color/color-predicate-toggle-symbol.component';

export interface P9SymbolPickerPredicateBuilderProps {
  expression?: P9ColorPredicateExpression;
  onSymbolToggle: (option: string, symbol: P9GameSymbolType) => void;
  options: P9CarouselToggleOption<string>[];
  symbols: P9GameSymbolType[];
}

export const P9SymbolPickerPredicateBuilder: FunctionComponent<P9SymbolPickerPredicateBuilderProps> = ({
  expression = {},
  onSymbolToggle,
  options,
  symbols,
}) => {
  const [option, setOption] = useState<string>(options[0].value);
  const handleToggle = useCallback(
    (symbol: P9GameSymbolType) => onSymbolToggle?.(option, symbol),
    [onSymbolToggle, option],
  );

  return (
    <>
      <P9RowView>
        <P9CarouselToggleButton onToggle={setOption} options={options} value={option} />
        <P9ColorPredicateSymbolToggleGroup symbols={symbols} expression={expression} onToggle={handleToggle} />
      </P9RowView>
    </>
  );
};
