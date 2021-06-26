import React, { FunctionComponent } from 'react';

import { P9ToggleButton, P9ToggleButtonProps } from '../button-toggle/toggle-button';
import { P9GameSymbol, P9GameSymbolType } from '../game-symbol/game-symbol';

export interface P9ColorToggleButtonProps extends P9ToggleButtonProps<P9GameSymbolType> {
  symbol?: P9GameSymbolType;
}

export const P9GameSymbolToggleButton: FunctionComponent<P9ColorToggleButtonProps> = ({ value, ...rest }) => {
  return (
    <P9ToggleButton {...rest} value={value}>
      <P9GameSymbol symbol={value!} />
    </P9ToggleButton>
  );
};
