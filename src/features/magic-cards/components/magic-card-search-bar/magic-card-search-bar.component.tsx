import React, { FunctionComponent, useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { P9SearchBox, P9SearchBoxProps, P9ToggleButton, P9ToggleButtonProps } from '../../../../components';
import { usePower9Theme } from '../../../../core/theme';
import { useMagicCardFilterFacade } from '../../../magic-card-filter';
import { useMagicCardGalleryFacade } from '../../../public/components';

export interface P9MagicCardSearchBarProps {
  containerStyle?: StyleProp<ViewStyle>;
  searchBoxProps?: Partial<P9SearchBoxProps>;
  toggleButtonProps?: Partial<P9ToggleButtonProps>;
}

export const P9MagicCardSearchBar: FunctionComponent<P9MagicCardSearchBarProps> = ({
  containerStyle,
  searchBoxProps,
  toggleButtonProps,
}) => {
  const [{ colors }] = usePower9Theme();
  const [{ canReset }, reset, handlePress] = useMagicCardFilterFacade();
  const [{ keywordExpression }, handleExpressionChange] = useMagicCardGalleryFacade();

  const handleLongPress = useCallback(() => {
    if (canReset) {
      reset();
    }
  }, [canReset, reset]);

  return (
    <View style={[P9SearchBarTheme.container, containerStyle]}>
      <P9SearchBox
        containerStyle={[P9SearchBarTheme.searchBoxContainer, searchBoxProps?.containerStyle]}
        expression={keywordExpression}
        onExpressionChange={handleExpressionChange}
        {...searchBoxProps}
      />
      <P9ToggleButton
        active={canReset}
        activeBackgroundColor={colors?.primary}
        activeTintColor={colors?.black}
        containerStyle={[toggleButtonProps?.containerStyle]}
        iconProps={{ name: 'tune' }}
        inactiveOpacity={1}
        onLongPress={handleLongPress}
        onPress={handlePress}
        {...toggleButtonProps}
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
    flexGrow: 1,
  },
});
