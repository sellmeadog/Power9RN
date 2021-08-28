import React, { FunctionComponent } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

export interface P9RowViewProps extends ViewProps {
  edges?: Edge[];
}

export const P9RowView: FunctionComponent<P9RowViewProps> = ({ edges, children, style, ...rest }) => {
  const Container = edges ? SafeAreaView : View;

  return (
    <Container edges={edges} {...rest} style={[P9RowViewTheme.row, style]}>
      {children}
    </Container>
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
