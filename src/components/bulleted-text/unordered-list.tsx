import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { P9BulletedText, P9BulletedTextProps } from './bulleted-text';

export interface P9UnorderedListProps {
  containerStyle?: StyleProp<ViewStyle>;
  items?: string[];
  itemProps?: P9BulletedTextProps;
}

export const P9UnorderedList: FunctionComponent<P9UnorderedListProps> = ({ containerStyle, items, itemProps }) => {
  return (
    <View style={[P9UnorderedListTheme.container, containerStyle]}>
      {items?.map((item, index) => (
        <P9BulletedText bullet={'\u2713'} key={index} {...itemProps} text={item} />
      ))}
    </View>
  );
};

const P9UnorderedListTheme = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});
