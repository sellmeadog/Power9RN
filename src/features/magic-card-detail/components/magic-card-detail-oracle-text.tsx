import React, { FunctionComponent, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { P9TableTitleDivider, P9ViewSurface } from '../../../components';
import { P9MagicCardFace } from '../../../core/public';
import { usePower9Theme } from '../../../core/theme';
import { P9MagicCardOracleText, P9MagicCardText } from '../../magic-cards';

export interface P9MagicCardDetailOracleTextProps {
  card_faces?: P9MagicCardFace[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const P9MagicCardDetailOracleText: FunctionComponent<P9MagicCardDetailOracleTextProps> = ({
  card_faces,
  containerStyle,
}) => {
  const [{ colors }] = usePower9Theme();
  const oracleTextNode = useMemo(
    () =>
      card_faces?.map(({ oracle_text, flavor_text }, index) => (
        <React.Fragment key={index.toString()}>
          <P9MagicCardOracleText oracle_text={oracle_text} />

          {flavor_text?.split(/\n/gi).map((line, fx) => (
            <View key={`${index}_flavor_text_${fx}`} style={P9MagicCardDetailOracleTextTheme.textLineContainer}>
              <P9MagicCardText
                oracleTextStyle={[P9MagicCardDetailOracleTextTheme.flavorText, { color: colors?.grey5 }]}
              >
                {line}
              </P9MagicCardText>
            </View>
          ))}
        </React.Fragment>
      )),
    [card_faces, colors],
  );

  return (
    <View style={[containerStyle]}>
      <P9TableTitleDivider>{'Oracle Text'}</P9TableTitleDivider>
      <P9ViewSurface style={P9MagicCardDetailOracleTextTheme.textContainer}>{oracleTextNode}</P9ViewSurface>
    </View>
  );
};

const P9MagicCardDetailOracleTextTheme = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 10,
  },

  textLineContainer: {
    paddingBottom: 8,
  },

  flavorText: {
    fontStyle: 'italic',
  },
});
