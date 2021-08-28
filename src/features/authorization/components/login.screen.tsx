import { useObservable, useObservableCallback, useObservableState } from 'observable-hooks';
import React, { FunctionComponent, useEffect } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Credentials } from 'realm';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { useNavigation } from '@react-navigation/core';

import { useAuthorizationFacade } from '../../../core/authorization';
import { usePower9Theme } from '../../../core/theme';

export interface P9LoginScreenProps {}

export const P9LoginScreen: FunctionComponent<P9LoginScreenProps> = () => {
  const [{ colors }] = usePower9Theme();
  const [{ error }, authenticate] = useAuthorizationFacade();
  const { canGoBack, goBack } = useNavigation();

  const [handleEmailAddressChange, emailAddress$] = useObservableCallback<string, string>((change$) =>
    change$.pipe(map((value) => value.trim())),
  );

  const [handlePasswordChange, password$] = useObservableCallback<string, string>((change$) =>
    change$.pipe(map((value) => value.trim())),
  );

  const credentials: Credentials.EmailPasswordPayload | undefined = useObservableState(
    useObservable(() => combineLatest({ username: emailAddress$, password: password$ })),
  );

  const handleAuthenticate = () => {
    if (credentials) {
      authenticate(credentials);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error?.message);
    }
  }, [error]);

  return (
    <>
      <KeyboardAvoidingView behavior={'padding'} style={[P9LoginScreenTheme.container]}>
        <Header
          rightComponent={{ text: 'Cancel', onPress: goBack, disabled: !canGoBack }}
          containerStyle={[P9LoginScreenTheme.headerContainer]}
        />
        <ImageBackground
          source={{
            uri: 'https://www.teahub.io/photos/full/315-3150851_black-lotus-mtg-art.jpg',
          }}
          resizeMode={'cover'}
          imageStyle={[P9LoginScreenTheme.backgroundImage]}
          style={[P9LoginScreenTheme.container]}
        >
          <View style={[P9LoginScreenTheme.container]} />
          <LinearGradient
            colors={['transparent', colors!.grey0!]}
            locations={[0.3, 1]}
            style={[P9LoginScreenTheme.gradient]}
          />
          <View style={[P9LoginScreenTheme.formContainer, { backgroundColor: colors?.grey0 }]}>
            <View>
              <Input
                label={'Email Address'}
                autoCapitalize={'none'}
                autoCompleteType={'email'}
                autoCorrect={false}
                keyboardType={'email-address'}
                onChangeText={handleEmailAddressChange}
              />
              <Input
                label={'Password'}
                secureTextEntry={true}
                onChangeText={handlePasswordChange}
                onSubmitEditing={handleAuthenticate}
              />
              <Button
                title={'Login'}
                containerStyle={[P9LoginScreenTheme.buttonContainer]}
                disabled={!credentials?.username || !credentials.password}
                onPress={handleAuthenticate}
              />
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
      <SafeAreaView edges={['bottom']} style={[P9LoginScreenTheme.footerContainer, { backgroundColor: colors?.grey0 }]}>
        <Pressable style={[P9LoginScreenTheme.footerButtonContainer]}>
          <Text style={[P9LoginScreenTheme.buttonTitle]}>
            {"Don't have an account? "}
            <Text style={[P9LoginScreenTheme.buttonCallToAction, { color: colors?.primary }]}>Sign Up</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
};

const P9LoginScreenTheme = StyleSheet.create({
  container: {
    flex: 1,
  },

  formContainer: {
    flexShrink: 1,
    justifyContent: 'space-between',
    padding: 32,
  },

  buttonContainer: {
    marginHorizontal: 10,
  },

  buttonTitle: {
    fontSize: 15,
  },

  buttonCallToAction: {
    fontWeight: '500',
  },

  footerContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  footerButtonContainer: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gradient: {
    flex: 1,
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '30%',
  },

  headerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
