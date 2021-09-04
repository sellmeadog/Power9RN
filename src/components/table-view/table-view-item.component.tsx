import React, { FunctionComponent } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export interface P9TableViewItemProps extends Omit<PressableProps, 'children' | 'style'> {
  containerStyle?: Animated.AnimatedStyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const P9TableViewItem: FunctionComponent<P9TableViewItemProps> = ({
  children,
  containerStyle,
  contentContainerStyle,
  ...rest
}) => {
  return (
    <Pressable {...rest}>
      <Animated.View style={[P9TableViewRowTheme.container, containerStyle]}>
        <View style={[P9TableViewRowTheme.contentContainer, contentContainerStyle]}>{children}</View>
      </Animated.View>
    </Pressable>
  );
};

const P9TableViewRowTheme = StyleSheet.create({
  container: {
    minHeight: 44,
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
