import React, { FunctionComponent, useCallback, useState } from 'react';

import {
  P9CarouselToggleButton,
  P9CarouselToggleOption,
  P9GameSymbolToggleButtonGroup,
  P9GameSymbolType,
  P9RowView,
} from '../../../../components';
import { P9SymbolPredicateExpression } from '../../model/predicate';

export interface P9SymbolPickerPredicateBuilderProps {
  expression?: P9SymbolPredicateExpression;
  onSymbolToggle: (option: string, symbol: P9GameSymbolType) => void;
  options: P9CarouselToggleOption<string>[];
  symbols: P9GameSymbolType[];
}

export const P9SymbolPickerPredicateBuilder: FunctionComponent<P9SymbolPickerPredicateBuilderProps> = ({
  expression,
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
        <P9GameSymbolToggleButtonGroup onToggle={handleToggle} options={symbols} selection={expression} />
      </P9RowView>
    </>
  );
};
