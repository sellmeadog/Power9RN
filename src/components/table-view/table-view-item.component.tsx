import React, { ComponentType, FunctionComponent, ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import Animated from 'react-native-reanimated';

import { usePower9Theme } from '../../core/theme';

export interface P9TableViewItemProps extends Omit<PressableProps, 'children' | 'style'> {
  LeftAccessory?: ComponentType | ReactNode;
  LeftComponent?: ComponentType | ReactNode;
  RightComponent?: ComponentType | ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftContainerStyle?: StyleProp<ViewStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const P9TableViewItem: FunctionComponent<P9TableViewItemProps> = ({
  children,
  LeftAccessory,
  LeftComponent,
  RightComponent,
  containerStyle,
  contentContainerStyle,
  leftContainerStyle,
  rightContainerStyle,
  title,
  titleStyle,
  onPress,
  onLongPress,
}) => {
  const [{ colors }] = usePower9Theme();
  // const [animated] = useState(new Animated.Value(0));
  // const [backgroundColorValue] = useState(
  //   animated.interpolate({ inputRange: [0, 1], outputRange: [colors!.grey2!, colors!.grey3!] }),
  // );

  // const handlePressIn = () => {
  //   animated.setValue(0);
  //   Animated.timing(animated, { toValue: 1, duration: 100, useNativeDriver: false }).start();
  // };

  // const handlePressOut = () => {
  //   animated.setValue(1);
  //   Animated.timing(animated, { toValue: 0, duration: 100, useNativeDriver: false }).start();
  // };

  return (
    <Pressable onLongPress={onLongPress} onPress={onPress}>
      <Animated.View style={[P9TableViewRowTheme.container, containerStyle]}>
        {/* <View style={[P9TableViewRowTheme.leftContainer, leftContainerStyle]}>
          {LeftAccessory && LeftAccessory}
          {LeftComponent
            ? LeftComponent
            : title && <Text style={[P9TableViewRowTheme.title, titleStyle]}>{title}</Text>}
        </View>
        {RightComponent && (
          <View style={[P9TableViewRowTheme.rightContainer, rightContainerStyle]}>{RightComponent}</View>
        )} */}
        <View style={[P9TableViewRowTheme.contentContainer, contentContainerStyle]}>{children}</View>
      </Animated.View>
    </Pressable>
  );
};

const P9TableViewRowTheme = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
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
