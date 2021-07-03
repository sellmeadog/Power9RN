import React, { FunctionComponent } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export interface P9TableViewItemProps extends Omit<PressableProps, 'children' | 'style'> {
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const P9TableViewItem: FunctionComponent<P9TableViewItemProps> = ({
  children,
  containerStyle,
  contentContainerStyle,
  onPress,
  onLongPress,
}) => {
  return (
    <Pressable onLongPress={onLongPress} onPress={onPress}>
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

  leftContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },

  rightContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: '500',
  },
});