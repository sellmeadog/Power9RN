import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { Text } from 'react-native-elements';

import { P9TableTitleDivider, P9ViewSurface } from '../../../components';

export interface P9MagicCardDetailLegalityProps {
  legalities?: string[];
}

enum P9GameFormat {
  standard = 'standard',
  historic = 'historic',
  pioneer = 'pioneer',
  modern = 'modern',
  legacy = 'legacy',
  vintage = 'vintage',
  pauper = 'pauper',
  brawl = 'brawl',
  commander = 'commander',
  oathbreaker = 'oathbreaker',
}

type P9GameFormatStatus = 'banned' | 'legal' | 'not_legal' | 'restricted';

type P9GameFormatStatusMap = {
  [key in keyof typeof P9GameFormat]: P9GameFormatStatus;
};

const formats: P9GameFormat[] = [
  P9GameFormat.standard,
  P9GameFormat.historic,
  P9GameFormat.pioneer,
  P9GameFormat.modern,
  P9GameFormat.legacy,
  P9GameFormat.vintage,
  P9GameFormat.pauper,
  P9GameFormat.brawl,
  P9GameFormat.commander,
  P9GameFormat.oathbreaker,
];

const DEFAULT_GAME_FORMAT_STATUS_MAP: P9GameFormatStatusMap = {
  brawl: 'not_legal',
  commander: 'not_legal',
  historic: 'not_legal',
  legacy: 'not_legal',
  modern: 'not_legal',
  pauper: 'not_legal',
  pioneer: 'not_legal',
  standard: 'not_legal',
  vintage: 'not_legal',
  oathbreaker: 'not_legal',
};

export const P9MagicCardDetailLegality: FunctionComponent<P9MagicCardDetailLegalityProps> = ({ legalities = [] }) => {
  const nodes = useMemo(() => {
    const data = legalities
      .map((s) => s.split(':'))
      .reduce((current, [key, value]) => ({ ...current, [key]: value }), DEFAULT_GAME_FORMAT_STATUS_MAP);

    return formats.map((format) => (
      <View key={format} style={P9MagicCardLegalitySectionTheme.statusContainer}>
        <View style={P9MagicCardLegalitySectionTheme[data[format]]}>
          <Text style={[P9MagicCardLegalitySectionTheme.status]}>{getFormatStatusDisplayName(data[format])}</Text>
        </View>
        <Text style={[P9MagicCardLegalitySectionTheme.format]}>{format}</Text>
      </View>
    ));
  }, [legalities]);

  return (
    <P9ViewSurface>
      <P9TableTitleDivider>{'Legality'}</P9TableTitleDivider>
      <View style={[P9MagicCardLegalitySectionTheme.container]}>{nodes}</View>
    </P9ViewSurface>
  );
};

function getFormatStatusDisplayName(status: P9GameFormatStatus): string {
  return status === 'not_legal' ? 'Not Legal' : status;
}

const statusContainerObject: TextStyle = {
  alignItems: 'center',
  borderRadius: 3,
  flex: 1,
  justifyContent: 'center',
  marginVertical: 2,
  padding: 4,
};

const P9MagicCardLegalitySectionTheme = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'stretch',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '50%',
    paddingRight: 10,
  },

  status: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '600',
  },

  format: {
    flex: 1.25,
    paddingLeft: 8,
    fontWeight: '500',
    fontSize: 14,
    textTransform: 'capitalize',
  },

  banned: {
    ...statusContainerObject,
    backgroundColor: 'rgb(206,127,133)',
  },

  legal: {
    ...statusContainerObject,
    backgroundColor: 'rgb(113,153,112)',
  },

  not_legal: {
    ...statusContainerObject,
    backgroundColor: 'rgb(174,174,174)',
  },

  restricted: {
    ...statusContainerObject,
    backgroundColor: 'rgb(126,166,182)',
  },
});
