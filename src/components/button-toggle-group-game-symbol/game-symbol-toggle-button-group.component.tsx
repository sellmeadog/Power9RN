import React, { FunctionComponent } from 'react';

import { P9GameSymbolToggleButton } from '../button-toggle-game-symbol/game-symbol-toggle-button.component';
import { P9ToggleButtonGroup, P9ToggleButtonGroupProps } from '../button-toggle-group/toggle-button-group.component';
import { P9GameSymbolType } from '../game-symbol/game-symbol';

export interface P9GameSymbolToggleButtonGroupProps
  extends Omit<P9ToggleButtonGroupProps<P9GameSymbolType>, 'ToggleButtonComponent'> {}

export const P9GameSymbolToggleButtonGroup: FunctionComponent<P9GameSymbolToggleButtonGroupProps> = (props) => {
  return <P9ToggleButtonGroup {...props} ToggleButtonComponent={P9GameSymbolToggleButton} />;
};
