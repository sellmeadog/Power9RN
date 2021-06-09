import React, { FunctionComponent } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export interface P9RowViewProps extends ViewProps {}

export const P9RowView: FunctionComponent<P9RowViewProps> = ({ children, style, ...rest }) => {
  return (
    <View {...rest} style={[P9RowViewTheme.row, style]}>
      {children}
    </View>
  );
};

const P9RowViewTheme = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    minHeight: 44,
  },
});
