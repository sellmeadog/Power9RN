import React, { FunctionComponent, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Bar as ProgressBar } from 'react-native-progress';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePublicPartitionMetadata } from '../../../../core/public';
import { usePower9Theme } from '../../../../core/theme';

export interface P9MagicCardGalleryMetadataProps {}

export const P9MagicCardGalleryMetadata: FunctionComponent<P9MagicCardGalleryMetadataProps> = () => {
  const { downloadProgress, isEmpty } = usePublicPartitionMetadata();
  const { width } = useWindowDimensions();
  const [{ colors }] = usePower9Theme();

  const animated = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    bottom: withDelay(1000, withTiming(interpolate(animated.value, [0, 1], [0, -100]), { duration: 250 })),
  }));

  useEffect(() => {
    if (downloadProgress === 1) {
      animated.value = downloadProgress;
    }
  }, [animated, downloadProgress]);

  return (
    <Animated.View style={animatedStyle}>
      <SafeAreaView
        edges={['bottom']}
        style={[
          { backgroundColor: colors?.grey0 },
          P9MagicCardGalleryMetadataTheme.container,
          P9MagicCardGalleryMetadataTheme.shadow,
        ]}
      >
        <View style={P9MagicCardGalleryMetadataTheme.progressContainer}>
          <View style={P9MagicCardGalleryMetadataTheme.progressContainerLeft}>
            <ActivityIndicator size={'small'} />
          </View>
          <View style={P9MagicCardGalleryMetadataTheme.progressContainerRight}>
            <Text style={[P9MagicCardGalleryMetadataTheme.title, P9MagicCardGalleryMetadataTheme.shadow]}>
              {isEmpty
                ? 'Connecting to the database...'
                : downloadProgress === 1
                ? 'Download complete'
                : 'Downloading updates...'}
            </Text>
            <ProgressBar
              borderColor={colors?.white}
              color={colors?.white}
              progress={downloadProgress}
              unfilledColor={colors?.grey5}
              width={width - 60}
            />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const P9MagicCardGalleryMetadataTheme = StyleSheet.create({
  container: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressContainerLeft: {
    width: 44,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressContainerRight: {
    flex: 1,
  },

  title: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 19,
    fontWeight: '500',
    paddingBottom: 8,
  },

  shadow: {
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
