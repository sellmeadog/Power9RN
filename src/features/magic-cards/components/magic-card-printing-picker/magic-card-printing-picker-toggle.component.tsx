import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { P9PressableHighlight } from '../../../../components';
import { P9MagicCard } from '../../../../core/public';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardPrintingPickerToggleProps {
  containerStyle?: StyleProp<ViewStyle>;
  onToggle?: () => void;
  printing?: P9MagicCard;
  printingCount?: number;
}

export const P9MagicCardPrintingPickerToggle: FunctionComponent<P9MagicCardPrintingPickerToggleProps> = ({
  containerStyle,
  onToggle,
  printing,
  printingCount,
}) => {
  const [{ colors }] = usePower9Theme();

  return (
    <P9PressableHighlight
      onPress={onToggle}
      inactiveColor={colors?.grey2}
      pressableContainerStyle={[P9MagicCardPrintingPickerToggleTheme.container, containerStyle]}
    >
      <View>
        <Text style={[P9MagicCardPrintingPickerToggleTheme.title]}>{printing?.magic_set.name}</Text>
      </View>
      <View style={[P9MagicCardPrintingPickerToggleTheme.subtitleContainer]}>
        <Text style={[P9MagicCardPrintingPickerToggleTheme.subtitle, { color: colors?.grey5 }]}>
          {printing?.magic_set.code.toUpperCase()} &middot; {printing?.collector_number} &middot;{' '}
          {printing?.rarity.toUpperCase()}
        </Text>
        <View style={[P9MagicCardPrintingPickerToggleTheme.printingCountContainer]}>
          <Text style={[P9MagicCardPrintingPickerToggleTheme.subtitle, { color: colors?.primary }]}>
            {(printingCount ?? 1) > 1 ? `${printingCount} Printings` : '1 Printing'}
          </Text>
          <Icon name={'arrow-drop-down'} />
        </View>
      </View>
    </P9PressableHighlight>
  );
};

const P9MagicCardPrintingPickerToggleTheme = StyleSheet.create({
  container: {
    borderTopColor: '#000',
    borderTopWidth: 1,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    height: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 17,
  },

  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  printingCountContainer: {
    flexDirection: 'row',
  },
});
