import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { usePower9Theme } from '../../core/theme';
import { P9ListItem } from '../list/list-item';
import { P9TablePickerItemAccessory } from './picker-table-item-accessory';

export type P9PickerTableSelectionChange = { value: string; selected: boolean };

export interface P9PickerTableItemProps {
  onSelect(event: P9PickerTableSelectionChange): void;
  selected?: boolean;
  title: string;
  value: string;
}

export const P9PickerTableItem_: FunctionComponent<P9PickerTableItemProps> = ({
  onSelect,
  selected = false,
  title,
  value,
}) => {
  const [{ colors }] = usePower9Theme();

  const highlightColor = useSharedValue(colors?.background);
  const highlightStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(highlightColor.value!, { duration: 100 }),
    };
  });

  const handlePress = () => onSelect?.({ value, selected: !selected });
  const handlePressIn = useCallback(() => (highlightColor.value = colors!.grey0), [highlightColor, colors]);
  const handlePressOut = useCallback(() => (highlightColor.value = colors!.background), [highlightColor, colors]);

  console.debug('Rendering', title);

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <P9ListItem style={[P9PickerTableItemTheme.container, highlightStyle]}>
        <Text>{title}</Text>
        <P9TablePickerItemAccessory selected={selected} />
      </P9ListItem>
    </Pressable>
  );
};

export const P9PickerTableItem = React.memo(P9PickerTableItem_);

const P9PickerTableItemTheme = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
