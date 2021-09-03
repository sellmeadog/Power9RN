/* eslint-disable react-native/no-inline-styles */
import React, { FunctionComponent, useCallback } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { usePower9Theme } from '../../core/theme';
import { P9TableViewItem, P9TableViewItemProps } from './table-view-item.component';

export interface P9TableViewActionItemProps extends P9TableViewItemProps {
  accessory?: 'arrow-forward-ios' | 'open-in-new';
  action?: boolean;
  primary?: boolean;
  title: string;
}

export const P9TableViewActionItem: FunctionComponent<P9TableViewActionItemProps> = ({
  accessory,
  action,
  disabled,
  onLongPress,
  onPress,
  primary,
  title,
}) => {
  const [{ colors }] = usePower9Theme();

  const highlightColor = useSharedValue(colors?.background);
  const highlightStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(highlightColor.value!, { duration: 100 }),
    };
  });

  const handleLongPress = useCallback((event: GestureResponderEvent) => onLongPress?.(event), [onLongPress]);
  const handlePress = useCallback((event: GestureResponderEvent) => onPress?.(event), [onPress]);

  const handlePressIn = useCallback(() => {
    if (onLongPress || onPress) {
      highlightColor.value = colors!.grey0;
    }
  }, [colors, highlightColor, onLongPress, onPress]);

  const handlePressOut = useCallback(() => {
    if (onLongPress || onPress) {
      highlightColor.value = colors!.background;
    }
  }, [colors, highlightColor, onLongPress, onPress]);

  return (
    <P9TableViewItem
      containerStyle={highlightStyle}
      contentContainerStyle={[P9TableViewActionItemTheme.contentContainer]}
      disabled={disabled}
      onLongPress={handleLongPress}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          {
            color: disabled ? colors?.grey5 : action ? colors?.primary : colors?.white,
            fontWeight: primary ? '600' : 'normal',
          },
        ]}
      >
        {title}
      </Text>
      {accessory && !disabled && <Icon name={accessory} />}
    </P9TableViewItem>
  );
};

const P9TableViewActionItemTheme = StyleSheet.create({
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 7,
  },
});
