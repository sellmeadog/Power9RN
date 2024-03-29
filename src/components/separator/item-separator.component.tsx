import React, { FunctionComponent } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { usePower9Theme } from '../../core/theme';

export interface P9ItemSeparatorProps extends ViewProps {
  color?: string;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
}

export const P9ItemSeparator: FunctionComponent<P9ItemSeparatorProps> = ({
  color,
  marginBottom,
  marginLeft = 10,
  marginRight,
  marginTop,
  style,
  ...rest
}) => {
  const [{ colors }] = usePower9Theme();

  return (
    <View
      {...rest}
      style={[
        P9ItemSeparatorTheme.container,
        { backgroundColor: color ?? colors?.grey3, marginBottom, marginLeft, marginRight, marginTop },
        style,
      ]}
    />
  );
};

const P9ItemSeparatorTheme = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
  },
});
