import React, { FunctionComponent } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';

import { P9MagicCard } from '../../../../core/public';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardPrintingPickerToggleProps {
  containerStyle?: StyleProp<ViewStyle>;
  onToggle?: () => void;
  printing?: P9MagicCard;
}

export const P9MagicCardPrintingPickerToggle: FunctionComponent<P9MagicCardPrintingPickerToggleProps> = ({
  containerStyle,
  onToggle,
  printing,
}) => {
  const [{ colors }] = usePower9Theme();

  return (
    <Pressable onPress={onToggle} style={[P9MagicCardPrintingPickerToggleTheme.container, containerStyle]}>
      <Text style={[P9MagicCardPrintingPickerToggleTheme.title]}>{printing?.magic_set.name}</Text>
      <Text style={[P9MagicCardPrintingPickerToggleTheme.subtitle, { color: colors?.grey5 }]}>
        {printing?.magic_set.code.toUpperCase()} &middot; {printing?.collector_number} &middot;{' '}
        {printing?.rarity.toUpperCase()}
      </Text>
    </Pressable>
  );
};

const P9MagicCardPrintingPickerToggleTheme = StyleSheet.create({
  container: {
    borderTopColor: '#000',
    borderTopWidth: 1,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  title: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 17,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
});
