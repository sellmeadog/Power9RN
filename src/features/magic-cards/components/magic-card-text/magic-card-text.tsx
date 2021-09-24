import React, { FunctionComponent, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { getGameSymbolSource, P9ParsedText, P9TextParseRule } from '../../../../components';

export interface P9MagicCardTextProps {
  gameSymbolStyle?: StyleProp<ImageStyle>;
  oracleTextStyle?: StyleProp<TextStyle>;
  reminderTextStyle?: StyleProp<TextStyle>;
}

export const P9MagicCardText: FunctionComponent<P9MagicCardTextProps> = ({
  children,
  gameSymbolStyle,
  oracleTextStyle,
  reminderTextStyle,
}) => {
  const parsers: P9TextParseRule[] = useMemo(() => {
    return [
      {
        pattern: /(\(.*?\))/gi,
        style: [{ fontSize: 17, fontStyle: 'italic' }, reminderTextStyle],
      },
      {
        pattern: /({.*?[^:| \n]*})/gi,
        style: gameSymbolStyle,
        transform: (match: string, style?: StyleProp<ImageStyle>) =>
          match.match(/{(.*?)}/gi)?.map((token, index) => {
            return (
              <FastImage
                key={`${token}_${index}`}
                source={getGameSymbolSource(token.replace('/', ''))}
                style={[P9MagicCardTextTheme.gameSymbol, style]}
                resizeMode={'contain'}
              />
            );
          }),
      },
    ];
  }, [gameSymbolStyle, reminderTextStyle]);

  return (
    <P9ParsedText parsers={parsers} style={[oracleTextStyle]}>
      {children}
    </P9ParsedText>
  );
};

const P9MagicCardTextTheme = StyleSheet.create({
  gameSymbol: {
    aspectRatio: 1,
    width: 14,
    marginRight: 2,
  },
});
