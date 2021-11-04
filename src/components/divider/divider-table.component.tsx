import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from 'react-native-elements';

import { usePower9Theme } from '../../core/theme';

export interface P9TableDividerProps {
  actionHandler?: () => void;
  actionStyle?: StyleProp<TextStyle>;
  actionText?: string;
  actionVisible?: boolean;
  borderBottom?: boolean;
  borderBottomWidth?: number;
  borderTop?: boolean;
  borderTopWidth?: number;
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const P9TableDivider: FunctionComponent<P9TableDividerProps> = ({
  actionHandler,
  actionStyle,
  actionText,
  actionVisible = false,
  borderBottom = true,
  borderBottomWidth = StyleSheet.hairlineWidth,
  borderTop,
  borderTopWidth = StyleSheet.hairlineWidth,
  containerStyle,
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
        containerStyle,
      ]}
    >
      <Text style={[P9TableDividerTheme.title, titleStyle]}>{title}</Text>
      {actionVisible && (
        <Button
          buttonStyle={P9TableDividerTheme.actionButton}
          icon={{ name: 'arrow-forward-ios', size: 20 }}
          iconRight
          onPress={actionHandler}
          title={actionText ?? '15'}
          titleStyle={[P9TableDividerTheme.actionTitle, actionStyle]}
          type={'clear'}
        />
      )}
    </View>
  );
};

const P9TableDividerTheme = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    height: 40,
    justifyContent: 'space-between',
    paddingBottom: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },

  actionButton: {
    margin: 0,
    padding: 0,
  },

  actionTitle: {
    fontSize: 17,
  },

  title: {
    fontSize: 17,
    fontFamily: 'Beleren2016SmallCaps-Bold',
    textTransform: 'capitalize',
  },
});
