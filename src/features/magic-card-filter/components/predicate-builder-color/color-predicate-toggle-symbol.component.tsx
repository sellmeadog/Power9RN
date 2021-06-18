import React, { FunctionComponent } from 'react';

import { P9GameSymbolToggleButton, P9GameSymbolType, P9RowView } from '../../../../components';
import { P9ColorPredicateExpression } from '../../model/predicate';
import { P9ColorPredicateBuilderTheme } from './color-predicate-builder.theme';

export interface P9ColorPredicateSymbolToggleGroupProps {
  symbols: P9GameSymbolType[];
  expression: P9ColorPredicateExpression | undefined;
  onToggle?(symbol: P9GameSymbolType, value: boolean): void;
}

export const P9ColorPredicateSymbolToggleGroup: FunctionComponent<P9ColorPredicateSymbolToggleGroupProps> = ({
  symbols,
  expression,
  onToggle,
}) => {
  return (
    <P9RowView style={[P9ColorPredicateBuilderTheme.pickerContainer]}>
      {symbols.map((symbol) => (
        <P9GameSymbolToggleButton
          active={expression?.[symbol]}
          key={symbol}
          color={symbol}
          containerStyle={[P9ColorPredicateBuilderTheme.pickerButtonContainer]}
          onToggle={onToggle}
          value={symbol}
        />
      ))}
    </P9RowView>
  );
};
