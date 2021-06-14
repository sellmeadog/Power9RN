import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

export interface P9PickerTableEmptyPlaceholderProps {
  message?: string;
}

export const P9PickerTableEmptyPlaceholder: FunctionComponent<P9PickerTableEmptyPlaceholderProps> = ({
  message = 'No Items Found',
}) => {
  return (
    <View style={[P9PickerTableEmptyPlaceholderTheme.container]}>
      <Text style={[P9PickerTableEmptyPlaceholderTheme.message]}>{message}</Text>
      <Text>Check your spelling and try a more general search value.</Text>
    </View>
  );
};

const P9PickerTableEmptyPlaceholderTheme = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    fontSize: 19,
  },
});
