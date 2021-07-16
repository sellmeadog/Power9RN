import React, { FunctionComponent, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { P9SpringButton } from '../button-spring/spring-button';
import { P9RowView } from '../layout/row.component';

export interface P9SpinButtonProps {
  onValueChange?(value: number): void;
  title?: string;
  value?: number;
}

export const P9SpinButton: FunctionComponent<P9SpinButtonProps> = ({ onValueChange, title, value = 0 }) => {
  const handleDecrement = useCallback(() => {
    if (value > 0) {
      onValueChange?.(value - 1);
    }
  }, [onValueChange, value]);

  const handleIncrement = useCallback(() => {
    onValueChange?.(value + 1);
  }, [onValueChange, value]);

  return (
    <View style={P9SpinButtonTheme.container}>
      <View>
        {title && <Text style={[P9SpinButtonTheme.titleText]}>{title}</Text>}
        <P9RowView style={[P9SpinButtonTheme.buttonGroupContainer]}>
          <P9SpringButton iconProps={{ name: 'minus', type: 'material-community' }} onPress={handleDecrement} />
          <Text style={[P9SpinButtonTheme.buttonText]}>{value}</Text>
          <P9SpringButton iconProps={{ name: 'plus', type: 'material-community' }} onPress={handleIncrement} />
        </P9RowView>
      </View>
    </View>
  );
};

const P9SpinButtonTheme = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  buttonGroupContainer: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 0,
  },

  buttonText: {
    alignSelf: 'flex-end',
    fontFamily: 'Beleren2016-Bold',
    fontSize: 48,
    marginHorizontal: 8,
  },

  titleText: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
