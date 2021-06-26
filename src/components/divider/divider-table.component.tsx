import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { usePower9Theme } from '../../core/theme';

export interface P9TableDividerProps {
  title?: string;
}

export const P9TableDivider: FunctionComponent<P9TableDividerProps> = ({ title }) => {
  const [{ colors }] = usePower9Theme();

  return (
    <View
      style={[
        P9TableDividerTheme.container,
        { backgroundColor: colors?.grey0, borderBottomColor: colors?.grey3, borderTopColor: colors?.grey3 },
      ]}
    >
      <Text style={[P9TableDividerTheme.title]}>{title}</Text>
    </View>
  );
};

const P9TableDividerTheme = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 40,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 17,
    fontFamily: 'Beleren2016SmallCaps-Bold',
  },
});
