import React, { FunctionComponent, useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { usePower9Theme } from '../../core/theme';
import { useMagicCardFilterFacade } from '../../features/magic-card-filter/state/magic-card-filter.service';
import { P9ToggleButton } from '../button-toggle/toggle-button';
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
  const [{ colors }] = usePower9Theme();
  const [{ canReset }, reset, handlePress] = useMagicCardFilterFacade();

  const handleLongPress = useCallback(() => {
    if (canReset) {
      reset();
    }
  }, [canReset, reset]);

  return (
    <View style={[P9SearchBarTheme.container, containerStyle]}>
      <P9SearchBox
        containerStyle={[P9SearchBarTheme.searchBoxContainer, searchBoxContainerStyle]}
        expression={expression}
        onExpressionChange={onExpressionChange}
      />
      <P9ToggleButton
        active={canReset}
        activeBackgroundColor={colors?.primary}
        activeTintColor={colors?.black}
        containerStyle={[P9SearchBarTheme.toggleButtonContainer, toggleButtonContainerStyle]}
        iconProps={{ name: 'tune' }}
        inactiveOpacity={1}
        onLongPress={handleLongPress}
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
