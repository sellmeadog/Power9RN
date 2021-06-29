import React, { FunctionComponent } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/core';

import { usePower9Theme } from '../../../core/theme';

export interface P9MagicCardDetailHeaderProps {
  scrollOffset: number;
  scrollY: Animated.SharedValue<number>;
  title?: string;
}

export const P9MagicCardDetailHeader: FunctionComponent<P9MagicCardDetailHeaderProps> = ({
  scrollOffset,
  scrollY,
  title,
}) => {
  const { canGoBack, goBack } = useNavigation();
  const [{ colors }] = usePower9Theme();

  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: colors?.background,
    height: StyleSheet.hairlineWidth,
    opacity: interpolate(scrollY?.value || 0, [0, scrollOffset - 44, scrollOffset], [0, 0, 1], Extrapolate.CLAMP),
    shadowColor: colors?.black,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY?.value || 0, [0, scrollOffset - 22, scrollOffset], [0, 0, 1], Extrapolate.CLAMP),
  }));

  return (
    <SafeAreaView edges={['top']} style={[P9MagicCardDetailHeaderTheme.container]}>
      <View style={[P9MagicCardDetailHeaderTheme.header]}>
        <Icon
          name={'arrow-back-ios'}
          color={colors?.white}
          size={28}
          disabled={!canGoBack()}
          onPress={goBack}
          containerStyle={[P9MagicCardDetailHeaderTheme.edgeContainer]}
          iconStyle={[{ shadowColor: colors?.black }, P9MagicCardDetailHeaderTheme.icon] as TextStyle}
        />
        <Animated.View style={[P9MagicCardDetailHeaderTheme.centerContainer, titleStyle]}>
          <Text style={[{ color: colors?.white, shadowColor: colors?.black }, P9MagicCardDetailHeaderTheme.title]}>
            {title}
          </Text>
        </Animated.View>
        <View style={P9MagicCardDetailHeaderTheme.edgeContainer} />
      </View>
      <Animated.View style={[headerStyle]} />
    </SafeAreaView>
  );
};

const P9MagicCardDetailHeaderTheme = StyleSheet.create({
  container: {
    overflow: 'visible',
    zIndex: 2,
  },

  header: {
    flexBasis: 44,
    flexDirection: 'row',
  },

  centerContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },

  edgeContainer: {
    alignItems: 'center',
    flexBasis: 44,
    flexShrink: 1,
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 19,
    fontWeight: '400',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },

  icon: {
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});
