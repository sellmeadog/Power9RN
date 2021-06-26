import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { P9ToggleButton, P9ToggleButtonProps } from '../button-toggle/toggle-button';

const PIP_COLORS = {
  common: 'rgb(142,142,147)',
  uncommon: '#707883',
  rare: '#A58E4A',
  mythic: '#BF4427',
};

export type P9MagicCardRarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export interface P9MagicCardRarityToggleButtonProps extends P9ToggleButtonProps<P9MagicCardRarity> {}

export const P9MagicCardRarityToggleButton: FunctionComponent<P9MagicCardRarityToggleButtonProps> = ({
  value = 'common',
  ...rest
}) => {
  const pipBorderStyle = useMemo(() => P9MagicCardRarityToggleButtonTheme[value], [value]);
  const pipColor = useMemo(() => PIP_COLORS[value], [value]);

  return (
    <P9ToggleButton
      {...rest}
      containerStyle={[P9MagicCardRarityToggleButtonTheme.buttonContainer]}
      buttonStyle={[pipBorderStyle]}
      inactiveOpacity={0.3}
      value={value}
      iconProps={{ color: pipColor, name: 'check-circle' }}
    />
  );
};

const P9MagicCardRarityToggleButtonTheme = StyleSheet.create({
  pipContainer: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 9,
    justifyContent: 'center',
    width: 18,
  },

  buttonContainer: {
    marginLeft: 10,
  },

  common: {
    borderColor: PIP_COLORS.common, // '#1A1718',
    borderWidth: 3,
  },

  uncommon: {
    borderColor: PIP_COLORS.uncommon,
    borderWidth: 3,
  },

  rare: {
    borderColor: PIP_COLORS.rare,
    borderWidth: 3,
  },

  mythic: {
    borderColor: PIP_COLORS.mythic,
    borderWidth: 3,
  },
});
