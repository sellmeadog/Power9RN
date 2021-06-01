import React, { FunctionComponent, useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { P9ToggleButton } from '../button/toggle-button';
import { P9SearchBox } from '../search-box/search-box';

export interface P9SearchBarProps {
  containerStyle?: StyleProp<ViewStyle>;
  expression?: string;
  onExpressionChange?(value?: string): void;
  searchBoxContainerStyle?: StyleProp<ViewStyle>;
  toggleButtonContainerStyle?: StyleProp<ViewStyle>;
}

export const P9SearchBar: FunctionComponent<P9SearchBarProps> = ({
  containerStyle,
  expression,
  onExpressionChange,
  searchBoxContainerStyle,
  toggleButtonContainerStyle,
}) => {
  const { navigate } = useNavigation();
  const handlePress = useCallback(() => navigate('P9:MagicCardFilter'), [navigate]);

  return (
    <View style={[P9SearchBarTheme.container, containerStyle]}>
      <P9SearchBox
        containerStyle={[P9SearchBarTheme.searchBoxContainer, searchBoxContainerStyle]}
        expression={expression}
        onExpressionChange={onExpressionChange}
      />
      <P9ToggleButton
        containerStyle={[P9SearchBarTheme.toggleButtonContainer, toggleButtonContainerStyle]}
        iconProps={{ name: 'tune' }}
        onPress={handlePress}
      />
    </View>
  );
};

const P9SearchBarTheme = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexShrink: 1,
    justifyContent: 'center',
  },

  searchBoxContainer: {
    marginLeft: 5,
  },

  toggleButtonContainer: {
    marginLeft: 5,
  },
});
