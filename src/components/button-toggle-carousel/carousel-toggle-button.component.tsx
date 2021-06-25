import React, { PropsWithChildren, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Button } from 'react-native-elements';

export type P9CarouselToggleOption<T = any> = {
  title?: string;
  value: T;
};

export interface P9CarouselToggleButtonProps<T = any> {
  onToggle(value: T): void;
  options: P9CarouselToggleOption<T>[];
  titleStyle?: StyleProp<TextStyle>;
  value?: T;
}

export function P9CarouselToggleButton<T = any>({
  onToggle,
  options,
  titleStyle,
  value,
}: PropsWithChildren<P9CarouselToggleButtonProps<T>>) {
  const index = useMemo(() => (value ? options.findIndex((option) => option.value === value) : 0), [options, value]);
  const { title = (options[index].value as any).toString() } = options[index];

  const handlePress = () => {
    const nextIndex = index + 1;
    onToggle(options[nextIndex === options.length ? 0 : nextIndex].value);
  };

  return (
    <>
      <Button
        type={'clear'}
        onPress={handlePress}
        title={title}
        buttonStyle={[P9CarouselToggleTheme.button]}
        titleStyle={[P9CarouselToggleTheme.title, titleStyle]}
      />
    </>
  );
}

const P9CarouselToggleTheme = StyleSheet.create({
  button: {
    minHeight: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  title: {
    fontSize: 17,
  },
});
