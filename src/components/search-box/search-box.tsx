import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { usePower9Theme } from '../../core/theme';
import { P9TextInput } from '../input/text-input';

export interface P9SearchBoxProps {
  borderContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  expression?: string;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  onExpressionChange?: (expression: string) => void;
}

export const P9SearchBox: FunctionComponent<P9SearchBoxProps> = ({
  borderContainerStyle,
  containerStyle,
  expression,
  inputContainerStyle,
  inputStyle,
  onExpressionChange,
}) => {
  const [{ colors }] = usePower9Theme();

  return (
    <View style={[P9SearchBoxStyle.container, containerStyle]}>
      <View
        style={[
          { borderColor: colors?.border, backgroundColor: colors?.backgroundInput },
          P9SearchBoxStyle.frameContainer,
          borderContainerStyle,
        ]}>
        <Icon color={colors?.placeholder} name={'search'} size={19} style={[P9SearchBoxStyle.icon]} />
        <View style={[P9SearchBoxStyle.inputContainer, inputContainerStyle]}>
          <P9TextInput
            onChangeText={onExpressionChange}
            placeholder={'Search'}
            style={[P9SearchBoxStyle.input, inputStyle]}
            value={expression}
          />
        </View>
      </View>
    </View>
  );
};

const P9SearchBoxStyle = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 44,
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
  },

  frameContainer: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 34,
    overflow: 'hidden',
  },

  icon: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 2,
  },

  inputContainer: {
    flex: 1,
  },

  input: {
    height: 34,
    overflow: 'hidden',
    paddingRight: 10,
  },
});
