import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Bar as ProgressBar } from 'react-native-progress';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDownloadProgress } from '../../../../core/public';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardGalleryProgressProps {}

export const P9MagicCardGalleryProgress: FunctionComponent<P9MagicCardGalleryProgressProps> = () => {
  const { progress } = useDownloadProgress();
  const [{ colors }] = usePower9Theme();
  const { width } = useWindowDimensions();

  const animated = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: withTiming(interpolate(animated.value, [0, 1], [-50, 0]), { duration: 250 }),
  }));

  useEffect(() => {
    if (progress === 1) {
      animated.value = 0;
    } else if (progress > 0) {
      animated.value = 1;
    }
  });

  return (
    <Animated.View style={animatedStyle}>
      <SafeAreaView edges={['bottom']} style={[P9MagicCardGalleryProgressTheme.container]}>
        <ProgressBar
          animated
          borderColor={colors?.white}
          color={colors?.white}
          progress={progress}
          unfilledColor={colors?.grey5}
          width={width - 32}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const P9MagicCardGalleryProgressTheme = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
