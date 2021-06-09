import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, ImageStyle } from 'react-native-fast-image';

export interface P9GameSymbolProps {
  containerStyle?: StyleProp<ViewStyle>;
  imageProps?: Omit<FastImageProps, 'source' | 'style'>;
  imageStyle?: StyleProp<ImageStyle>;
  type: P9GameSymbolType;
}

export const P9GameSymbol: FunctionComponent<P9GameSymbolProps> = ({
  containerStyle,
  imageProps,
  imageStyle,
  type,
}) => {
  return (
    <View style={[P9GameSymbolTheme.container, containerStyle]}>
      <FastImage {...imageProps} source={P9GameSymbolSource[type]} style={[P9GameSymbolTheme.image, imageStyle]} />
    </View>
  );
};

const P9GameSymbolTheme = StyleSheet.create({
  container: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    aspectRatio: 1,
    flexGrow: 1,
  },
});

export type P9GameSymbolType =
  | '0'
  | '1'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '2'
  | '20'
  | '2B'
  | '2G'
  | '2R'
  | '2U'
  | '2W'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'B'
  | 'BG'
  | 'BP'
  | 'BR'
  | 'C'
  | 'CHAOS'
  | 'E'
  | 'G'
  | 'GP'
  | 'GU'
  | 'GW'
  | 'P'
  | 'PW'
  | 'Q'
  | 'R'
  | 'RG'
  | 'RP'
  | 'RW'
  | 'S'
  | 'T'
  | 'U'
  | 'UB'
  | 'UP'
  | 'UR'
  | 'W'
  | 'WB'
  | 'WP'
  | 'X';

type P9GameSymbolSourceMap = { [key in P9GameSymbolType]: number };

export const P9GameSymbolSource: P9GameSymbolSourceMap = {
  '0': require('../../assets/images/0.png'),
  '1': require('../../assets/images/1.png'),
  '10': require('../../assets/images/10.png'),
  '11': require('../../assets/images/11.png'),
  '12': require('../../assets/images/12.png'),
  '13': require('../../assets/images/13.png'),
  '14': require('../../assets/images/14.png'),
  '15': require('../../assets/images/15.png'),
  '16': require('../../assets/images/16.png'),
  '17': require('../../assets/images/17.png'),
  '18': require('../../assets/images/18.png'),
  '19': require('../../assets/images/19.png'),
  '2': require('../../assets/images/2.png'),
  '20': require('../../assets/images/20.png'),
  '2B': require('../../assets/images/2B.png'),
  '2G': require('../../assets/images/2G.png'),
  '2R': require('../../assets/images/2R.png'),
  '2U': require('../../assets/images/2U.png'),
  '2W': require('../../assets/images/2W.png'),
  '3': require('../../assets/images/3.png'),
  '4': require('../../assets/images/4.png'),
  '5': require('../../assets/images/5.png'),
  '6': require('../../assets/images/6.png'),
  '7': require('../../assets/images/7.png'),
  '8': require('../../assets/images/8.png'),
  '9': require('../../assets/images/9.png'),
  B: require('../../assets/images/B.png'),
  BG: require('../../assets/images/BG.png'),
  BP: require('../../assets/images/BP.png'),
  BR: require('../../assets/images/BR.png'),
  C: require('../../assets/images/C.png'),
  CHAOS: require('../../assets/images/CHAOS.png'),
  E: require('../../assets/images/E.png'),
  G: require('../../assets/images/G.png'),
  GP: require('../../assets/images/GP.png'),
  GU: require('../../assets/images/GU.png'),
  GW: require('../../assets/images/GW.png'),
  P: require('../../assets/images/P.png'),
  PW: require('../../assets/images/PW.png'),
  Q: require('../../assets/images/Q.png'),
  R: require('../../assets/images/R.png'),
  RG: require('../../assets/images/RG.png'),
  RP: require('../../assets/images/RP.png'),
  RW: require('../../assets/images/RW.png'),
  S: require('../../assets/images/S.png'),
  T: require('../../assets/images/T.png'),
  U: require('../../assets/images/U.png'),
  UB: require('../../assets/images/UB.png'),
  UP: require('../../assets/images/UP.png'),
  UR: require('../../assets/images/UR.png'),
  W: require('../../assets/images/W.png'),
  WB: require('../../assets/images/WB.png'),
  WP: require('../../assets/images/WP.png'),
  X: require('../../assets/images/X.png'),
};

export function getGameSymbolSource(token: P9GameSymbolType): number {
  let key: P9GameSymbolType;

  if (token.match(/{(.*?)}/i)) {
    key = token.replace(/{|}/gi, '') as P9GameSymbolType;
  } else {
    key = token;
  }

  return P9GameSymbolSource[key];
}
