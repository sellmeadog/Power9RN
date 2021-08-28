import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, TextInputProps, View, ViewStyle } from 'react-native';
import { Icon, IconProps } from 'react-native-elements';

import { usePower9Theme } from '../../core/theme';
import { P9TextInput } from '../input/text-input';

export interface P9SearchBoxProps {
  borderContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  expression?: string;
  iconProps?: Partial<IconProps>;
  InputComponent?: React.ComponentType<any>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputProps?: Partial<Omit<TextInputProps, 'onChangeText' | 'placeholder' | 'value'>>;
  inputStyle?: StyleProp<ViewStyle>;
  onExpressionChange?: (expression: string) => void;
  placeholder?: string;
}

export const P9SearchBox: FunctionComponent<P9SearchBoxProps> = ({
  borderContainerStyle,
  containerStyle,
  expression,
  iconProps,
  InputComponent = P9TextInput,
  inputContainerStyle,
  inputProps,
  inputStyle,
  onExpressionChange,
  placeholder,
}) => {
  const [{ colors, BottomSheetTextInput }] = usePower9Theme();

  return (
    <View style={[P9SearchBoxTheme.container, containerStyle]}>
      <View
        style={[
          { borderColor: colors?.border, backgroundColor: colors?.backgroundInput },
          P9SearchBoxTheme.borderContainer,
          borderContainerStyle,
        ]}
      >
        <Icon
          color={colors?.placeholder}
          name={'search'}
          size={19}
          containerStyle={[P9SearchBoxTheme.iconContainer]}
          {...iconProps}
        />
        <View style={[P9SearchBoxTheme.inputContainer, inputContainerStyle]}>
          <InputComponent
            clearButtonMode={'always'}
            multiline={false}
            numberOfLines={1}
            onChangeText={onExpressionChange}
            placeholder={placeholder ?? 'Search'}
            style={[P9SearchBoxTheme.input, inputStyle]}
            value={expression}
            {...BottomSheetTextInput}
            {...inputProps}
          />
        </View>
      </View>
    </View>
  );
};

const P9SearchBoxTheme = StyleSheet.create({
  container: {
    flexBasis: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 5,
  },

  borderContainer: {
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: 34,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  iconContainer: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 2,
  },

  inputContainer: {
    flex: 1,
  },

  input: {
    flexBasis: 34,
    overflow: 'hidden',
    paddingRight: 10,
  },
});
