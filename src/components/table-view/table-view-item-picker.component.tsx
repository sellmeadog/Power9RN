import { useObservable, useSubscription } from 'observable-hooks';
import React, { useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Text } from 'react-native-elements';
import Animated, { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { fromEvent } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { Picker, PickerItemProps, PickerProps } from '@react-native-picker/picker';

import { usePower9Theme } from '../../core/theme';
import { P9ItemSeparator } from '../separator/item-separator.component';
import { P9TableViewItem } from './table-view-item.component';

export interface P9TableViewPickerItemProps<T> extends PickerProps {
  title: string;
  items: ReadonlyArray<T>;
  itemPropsExtractor(item: T): PickerItemProps;
}

export function P9TableViewPickerItem<T>({
  itemPropsExtractor,
  items,
  onValueChange,
  selectedValue,
  title,
}: P9TableViewPickerItemProps<T>) {
  const animated = useSharedValue(0);
  const [{ colors }] = usePower9Theme();
  const [collapsed, setCollapsed] = useState(true);

  useSubscription(
    useObservable(() => fromEvent(Keyboard, 'keyboardWillShow').pipe(mapTo(true))),
    setCollapsed,
  );

  useSubscription(
    useObservable((collapsed$) => collapsed$.pipe(map(([value]) => Number(value))), [collapsed]),
    (value) => {
      if (!value) {
        Keyboard.dismiss();
      }

      animated.value = withTiming(value, { duration: 250, easing: Easing.bezier(0.1, 0.76, 0.55, 0.9) });
    },
  );

  return (
    <>
      <P9TableViewItem onPress={() => setCollapsed((value) => !value)}>
        <Text style={[P9TableViewPickerItemTheme.title]}>{title || selectedValue}</Text>
        <Animated.Text style={[P9TableViewPickerItemTheme.value, { color: colors?.primary }]}>
          {selectedValue}
        </Animated.Text>
      </P9TableViewItem>
      <P9ItemSeparator />
      <Collapsible collapsed={collapsed} collapsedHeight={0}>
        <Picker itemStyle={{ color: colors?.white }} onValueChange={onValueChange} selectedValue={selectedValue}>
          {items.map((item, index) => (
            <Picker.Item key={index} {...itemPropsExtractor(item)} />
          ))}
        </Picker>
      </Collapsible>
    </>
  );
}

const P9TableViewPickerItemTheme = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  title: {
    fontSize: 15,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
  },

  value: {
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
});
