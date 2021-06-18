import React, { FunctionComponent } from 'react';

import { P9ToggleButton, P9ToggleButtonProps } from '../button-toggle/toggle-button';
import { P9GameSymbol, P9GameSymbolType } from '../game-symbol/game-symbol';

export interface P9ColorToggleButtonProps extends P9ToggleButtonProps {
  color: P9GameSymbolType;
}

export const P9GameSymbolToggleButton: FunctionComponent<P9ColorToggleButtonProps> = ({ color, ...rest }) => {
  return (
    <P9ToggleButton {...rest}>
      <P9GameSymbol type={color} />
    </P9ToggleButton>
  );
};
