import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';

export interface P9BulletedTextProps {
  bullet?: string;
  bulletContainerStyle?: StyleProp<ViewStyle>;
  bulletStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  text?: string;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const P9BulletedText: FunctionComponent<P9BulletedTextProps> = ({
  bullet = '•',
  bulletContainerStyle,
  bulletStyle,
  children,
  containerStyle,
  text,
  textContainerStyle,
  textStyle,
}) => {
  return (
    <View style={[P9BulletedTextTheme.container, containerStyle]}>
      <View style={[P9BulletedTextTheme.bulletContainer, { flexBasis: getFlexBasis(bullet) }, bulletContainerStyle]}>
        <Text style={[bulletStyle]}>{bullet}</Text>
      </View>
      <View style={[P9BulletedTextTheme.textContainer, textContainerStyle]}>
        {children || <Text style={[textStyle]}>{text}</Text>}
      </View>
    </View>
  );
};

const P9BulletedTextTheme = StyleSheet.create({
  container: { flexDirection: 'row', paddingBottom: 6 },
  bulletContainer: { alignItems: 'flex-end' },
  textContainer: { flex: 1, paddingLeft: 6 },
});

function getFlexBasis(bullet?: string): number {
  if (bullet === '•') {
    return 16;
  }

  return 20;
}
