import { useObservable, useSubscription } from 'observable-hooks';
import React, { useEffect, useState } from 'react';
import { ColorValue, Keyboard, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Text } from 'react-native-elements';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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

  const textStyle = useAnimatedStyle(
    (): TextStyle => ({
      color: interpolateColor(animated.value, [0, 1], [colors!.white!, colors!.primary!], 'RGB') as ColorValue,
    }),
  );

  useSubscription(
    useObservable(() => fromEvent(Keyboard, 'keyboardWillShow').pipe(mapTo(true))),
    setCollapsed,
  );

  // useSubscription(
  //   useObservable((collapsed$) => collapsed$, [collapsed]),
  //   (value) => {
  //     if (!value) {
  //       Keyboard.dismiss();
  //       animated.value = 0;
  //     }
  //   },
  // );

  // useEffect(() => {
  //   const subscription = Keyboard.addListener('keyboardWillShow', () => {
  //     setCollapsed(true);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    if (!collapsed) {
      Keyboard.dismiss();
    }

    animated.value = withTiming(collapsed ? 0 : 1, { duration: 250 });
  }, [animated, collapsed]);

  return (
    <>
      <P9TableViewItem onPress={() => setCollapsed((value) => !value)}>
        <Text style={[P9TableViewPickerItemTheme.title]}>{title || selectedValue}</Text>
        <Animated.Text style={[P9TableViewPickerItemTheme.value, textStyle]}>{selectedValue}</Animated.Text>
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
    fontSize: 17,
    paddingHorizontal: 10,
  },

  value: {
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
});
