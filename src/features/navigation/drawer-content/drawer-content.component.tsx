import React, { FunctionComponent, useCallback } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';

import { P9Avatar, P9CaptionText } from '../../../components';
import { useAuthorizationFacade } from '../../../core/authorization';
import { usePower9Theme } from '../../../core/theme';

export interface P9DrawerContentProps extends DrawerContentComponentProps {}

export const P9DrawerContent: FunctionComponent<P9DrawerContentProps> = (props) => {
  const [{ colors }] = usePower9Theme();
  const [{ isAnonymous, user }, authenticate] = useAuthorizationFacade();

  const handlePress = useCallback(() => {
    if (isAnonymous) {
      authenticate();
    }
  }, [authenticate, isAnonymous]);

  return (
    <SafeAreaView style={P9DrawerContentTheme.container}>
      <View style={P9DrawerContentTheme.avatarContainer}>
        <P9Avatar icon={{ color: colors?.grey5, name: 'person', size: 39 }} size={'medium'} />
        <Pressable onPress={handlePress} style={P9DrawerContentTheme.userContainer}>
          <Text style={[P9DrawerContentTheme.title]}>{isAnonymous ? 'Anonymous' : user?.customData?.handle}</Text>
          <Text style={[P9DrawerContentTheme.subtitle, { color: isAnonymous ? colors?.primary : colors?.white }]}>
            {isAnonymous ? 'Create Account' : 'Logged In'}
          </Text>
        </Pressable>
      </View>
      <View>
        <DrawerItemList {...props} />
      </View>
      <P9CaptionText style={[P9DrawerContentTheme.version]}>App Version &mdash; v0.30.5</P9CaptionText>
    </SafeAreaView>
  );
};

const P9DrawerContentTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  avatarContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  userContainer: {
    paddingLeft: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 13,
  },

  version: {
    padding: 16,
  },
});
