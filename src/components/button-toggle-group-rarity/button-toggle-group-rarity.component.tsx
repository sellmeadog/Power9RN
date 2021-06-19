import React, { FunctionComponent } from 'react';

import { P9ToggleButtonGroup, P9ToggleButtonGroupProps } from '../button-toggle-group/toggle-button-group.component';
import {
  P9MagicCardRarity,
  P9MagicCardRarityToggleButton,
} from '../button-toggle-rarity/button-toggle-rarity.component';

const MAGIC_CARD_RARITY_OPTIONS: P9MagicCardRarity[] = ['common', 'uncommon', 'rare', 'mythic'];

export interface P9MagicCardRarityToggleButtonGroupProps
  extends Omit<P9ToggleButtonGroupProps<P9MagicCardRarity>, 'options' | 'ToggleButtonComponent'> {}

export const P9MagicCardRarityToggleButtonGroup: FunctionComponent<P9MagicCardRarityToggleButtonGroupProps> = (
  props,
) => {
  return (
    <P9ToggleButtonGroup
      {...props}
      options={MAGIC_CARD_RARITY_OPTIONS}
      ToggleButtonComponent={P9MagicCardRarityToggleButton}
    />
  );
};
