import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Text } from 'react-native-elements';

import { usePower9Theme } from '../../core/theme';

export interface P9TableDividerProps {
  borderBottom?: boolean;
  borderBottomWidth?: number;
  borderTop?: boolean;
  borderTopWidth?: number;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const P9TableDivider: FunctionComponent<P9TableDividerProps> = ({
  borderBottom = true,
  borderBottomWidth = StyleSheet.hairlineWidth,
  borderTop,
  borderTopWidth = StyleSheet.hairlineWidth,
  title,
  titleStyle,
}) => {
  const [{ colors }] = usePower9Theme();

  return (
    <View
      style={[
        P9TableDividerTheme.container,
        {
          backgroundColor: colors?.grey0,
          borderBottomColor: colors?.grey3,
          borderBottomWidth: borderBottom ? borderBottomWidth : undefined,
          borderTopColor: colors?.grey3,
          borderTopWidth: borderTop ? borderTopWidth : undefined,
        },
      ]}
    >
      <Text style={[P9TableDividerTheme.title, titleStyle]}>{title}</Text>
    </View>
  );
};

const P9TableDividerTheme = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 17,
    fontFamily: 'Beleren2016SmallCaps-Bold',
    textTransform: 'capitalize',
  },
});
