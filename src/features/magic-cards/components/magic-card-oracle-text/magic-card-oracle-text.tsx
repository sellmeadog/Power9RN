import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { P9BulletedText } from '../../../../components';
import { P9MagicCardText } from '../magic-card-text/magic-card-text';

export interface P9MagicCardOracleTextProps {
  oracle_text?: string | null;
}

export const P9MagicCardOracleText: FunctionComponent<P9MagicCardOracleTextProps> = ({ oracle_text }) => {
  return useMemo(
    () => (
      <>
        {oracle_text?.split(/\n/gi).map((match, index) => {
          if (pattern.test(match)) {
            const groups = match.match(pattern);

            return (
              <P9BulletedText
                bullet={groups?.[1]}
                containerStyle={P9MagicCardOracleTextTheme.textContainer}
                key={index.toString()}
              >
                <P9MagicCardText>{groups?.[2]}</P9MagicCardText>
              </P9BulletedText>
            );
          } else {
            return (
              <View key={index.toString()} style={P9MagicCardOracleTextTheme.textContainer}>
                <P9MagicCardText>{match}</P9MagicCardText>
              </View>
            );
          }
        })}
      </>
    ),
    [oracle_text],
  );
};

const pattern = new RegExp(/^(•|[−+]\d+:)\s(.+)$/i);

const P9MagicCardOracleTextTheme = StyleSheet.create({
  textContainer: {
    paddingBottom: 6,
  },
});
