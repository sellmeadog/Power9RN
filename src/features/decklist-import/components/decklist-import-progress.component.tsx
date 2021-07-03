import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Circle as ProgressCircle } from 'react-native-progress';

import { usePower9Theme } from '../../../core/theme';

export interface P9DecklistImportProgressProps {
  overlayStyle?: ViewStyle;
  progress?: [number, number];
  size?: number;
}

export const P9DecklistImportProgress: FunctionComponent<P9DecklistImportProgressProps> = ({
  overlayStyle,
  progress,
  size,
}) => {
  const [{ colors }] = usePower9Theme();
  const percent = useMemo(() => {
    if (progress) {
      const [current, total] = progress;
      return current / total;
    }

    return 0;
  }, [progress]);

  if (!progress || percent === 1) {
    return null;
  }

  return (
    <View style={[P9DecklistImportProgressTheme.overlayContainer, overlayStyle]}>
      <ProgressCircle
        borderWidth={0}
        color={colors?.grey5}
        formatText={(value) => Math.round(value * 100).toString()}
        indeterminate={!percent}
        progress={percent}
        showsText={true}
        size={size}
        strokeCap={'round'}
        textStyle={P9DecklistImportProgressTheme.progressText}
      />
    </View>
  );
};

const P9DecklistImportProgressTheme = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(28,28,30,0.8)',
    justifyContent: 'center',
  },

  progressText: {
    fontFamily: 'Beleren2016-Bold',
  },
});
