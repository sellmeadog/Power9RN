import React, { FunctionComponent } from 'react';
import { StyleSheet, TextInputProps } from 'react-native';
import { Text } from 'react-native-elements';

import { P9TextInput } from '../input/text-input';
import { P9TableViewItem } from './table-view-item.component';

export interface P9TableViewInputItemProps extends TextInputProps {
  title?: string;
}

export const P9TableViewInputItem: FunctionComponent<P9TableViewInputItemProps> = ({
  clearButtonMode = 'always',
  multiline,
  placeholder,
  title,
  value,
  ...rest
}) => {
  return (
    <P9TableViewItem contentContainerStyle={[multiline && P9TableViewInputItemTheme.multilineContainer]}>
      {multiline && title && <Text style={[P9TableViewInputItemTheme.multilineTitle]}>{title}</Text>}
      <P9TextInput
        clearButtonMode={clearButtonMode}
        multiline={multiline}
        placeholder={placeholder}
        style={[multiline ? P9TableViewInputItemTheme.multilineInput : P9TableViewInputItemTheme.input]}
        value={value}
        {...rest}
      />
    </P9TableViewItem>
  );
};

export const P9TableViewInputItemTheme = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 10,
  },

  multilineContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    maxHeight: 300,
    minHeight: 250,
    paddingBottom: 10,
    paddingTop: 5,
  },

  multilineInput: {
    alignSelf: 'stretch',
    fontSize: 17,
    flex: 1,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },

  multilineTitle: {
    fontSize: 15,
    fontWeight: '500',
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
