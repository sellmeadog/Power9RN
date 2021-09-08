import React, { FunctionComponent, useCallback } from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Button, colors, Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import {
  P9DrawerNavigatorAvatar,
  P9ItemSeparator,
  P9ModalHeader,
  P9TitleLargeText,
  P9UnorderedList,
} from '../../../components';
import { useAuthorizationFacade } from '../../../core/authorization';

export interface P9AnonymousGuardProps {
  bullets?: string[];
  source?: ImageSourcePropType;
  subtitle: string;
  title: string;
}

export const P9AnonymousGuard: FunctionComponent<P9AnonymousGuardProps> = ({
  bullets,
  source = require('../../../assets/images/crop-xln-250-treasure-map.jpeg'),
  subtitle,
  title,
}) => {
  const [_, authenticate] = useAuthorizationFacade();
  const animated = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(animated.value, { duration: 500 }),
    transform: [{ translateY: withTiming(interpolate(animated.value, [0, 1], [100, 0]), { duration: 750 }) }],
  }));

  const handlePress = useCallback(() => authenticate(), [authenticate]);

  useFocusEffect(() => {
    animated.value = 1;

    return () => {
      animated.value = 0;
    };
  });

  return (
    <ImageBackground
      source={source}
      resizeMode={'cover'}
      imageStyle={[P9AnonymousCallToActionTheme.backgroundImage]}
      style={[P9AnonymousCallToActionTheme.container]}
    >
      <P9ModalHeader leftComponent={<P9DrawerNavigatorAvatar />} />
      <LinearGradient colors={['transparent', colors!.grey0!]} locations={[0, 0.15]}>
        <Animated.View style={[animatedStyle]}>
          <SafeAreaView edges={['bottom']}>
            <View>
              <P9TitleLargeText style={[P9AnonymousCallToActionTheme.title]}>{title}</P9TitleLargeText>
              <Text style={[P9AnonymousCallToActionTheme.paragraph, P9AnonymousCallToActionTheme.subtitle]}>
                {subtitle}
              </Text>
              <P9UnorderedList containerStyle={[P9AnonymousCallToActionTheme.paragraph]} items={bullets} />
            </View>
            <P9ItemSeparator color={colors?.grey5} marginBottom={42} marginLeft={64} marginRight={64} marginTop={22} />
            <Button
              containerStyle={[P9AnonymousCallToActionTheme.buttonContainer]}
              onPress={handlePress}
              title={'Create Account'}
            />
            <Button
              containerStyle={[P9AnonymousCallToActionTheme.buttonContainer]}
              onPress={handlePress}
              title={'Already have an account? Login'}
              type={'clear'}
            />
          </SafeAreaView>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};

const P9AnonymousCallToActionTheme = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '30%',
  },

  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  title: {
    paddingHorizontal: 16,
  },

  subtitle: {
    fontSize: 19,
    fontWeight: '500',
    paddingTop: 0,
  },

  paragraph: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
