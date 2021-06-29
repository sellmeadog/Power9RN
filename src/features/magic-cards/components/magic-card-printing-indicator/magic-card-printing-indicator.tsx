import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { P9MagicSetSymbol, P9ViewSurface } from '../../../../components';
import { P9MagicSet } from '../../../../core/public';

export interface P9MagicCardPrintingIndicatorProps {
  collector_number?: string;
  containerStyle?: StyleProp<ViewStyle>;
  magic_set?: P9MagicSet;
  rarity?: string;
}

export const P9MagicCardPrintingIndicator: FunctionComponent<P9MagicCardPrintingIndicatorProps> = ({
  collector_number,
  containerStyle,
  magic_set,
  rarity,
}) => {
  return (
    <P9ViewSurface containerStyle={[P9MagicCardPrintingPickerTheme.container, containerStyle]}>
      <View style={[P9MagicCardPrintingPickerTheme.symbolContainer]}>
        <P9MagicSetSymbol sourceUri={magic_set?.icon_svg_uri} />
      </View>
      <View style={[P9MagicCardPrintingPickerTheme.contentContainer]}>
        <Text>{magic_set?.name}</Text>
        <Text style={[P9MagicCardPrintingPickerTheme.subtitle]}>
          {magic_set?.code?.toUpperCase()} {'\u2022'} #{collector_number} {'\u2022'} {rarity}
        </Text>
      </View>
      <View style={[P9MagicCardPrintingPickerTheme.toggleContainer]}>
        <Icon name={'expand-more'} size={34} />
      </View>
    </P9ViewSurface>
  );
};

export const P9MagicCardPrintingPickerTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 44,
  },

  symbolContainer: {
    alignItems: 'center',
    aspectRatio: 1,
    justifyContent: 'flex-start',
    width: 44,
  },

  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    paddingVertical: 2,
  },

  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
