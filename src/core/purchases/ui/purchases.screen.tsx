import React, { FunctionComponent } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { PurchasesEntitlementInfo, PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';

import { P9ItemSeparator, P9ModalHeader, P9TitleLargeText, P9UnorderedList } from '../../../components';
import { usePower9Theme } from '../../theme';
import { useActiveSubscription, useAvailablePackages } from '../state/purchases.query';
import { usePurchaseSubscription } from '../state/purchases.service';
import { P9PurchasesButtonGroup } from './purchases-button-group.component';

export interface P9PurchasesScreenProps {}

export const P9PurchasesScreen: FunctionComponent<P9PurchasesScreenProps> = () => {
  const [packages, activeSubscription, handlePurchase] = usePurchasesScreenFacade();
  const [{ colors }] = usePower9Theme();

  return (
    <ImageBackground
      source={require('../../../assets/images/crop-xln-250-treasure-map.jpeg')}
      resizeMode={'cover'}
      imageStyle={[P9PurchasesScreenTheme.backgroundImage]}
      style={[P9PurchasesScreenTheme.container]}
    >
      <P9ModalHeader />
      <LinearGradient colors={['transparent', colors!.grey0!]} locations={[0, 0.15]}>
        <SafeAreaView edges={['bottom']}>
          <View>
            <P9TitleLargeText>{'Upgrade to Power 9+'}</P9TitleLargeText>
            <Text style={[P9PurchasesScreenTheme.paragraph]}>
              {'Unlock unlimited access to all features. Start a free trial today. Cancel anytime.'}
            </Text>
            <P9UnorderedList
              containerStyle={[P9PurchasesScreenTheme.paragraph]}
              items={['Remove ads', 'Build unlimted decks', 'An angel gets its wings']}
            />
          </View>
          <P9ItemSeparator color={colors?.grey5} marginBottom={42} marginLeft={64} marginRight={64} marginTop={22} />
          <P9PurchasesButtonGroup
            activeProductIdentifier={activeSubscription?.productIdentifier}
            packages={packages}
            onPurchase={handlePurchase}
          />
          <Button
            containerStyle={[P9PurchasesScreenTheme.buttonContainer]}
            title={'Already a subscriber? Restore Now.'}
            type={'clear'}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const P9PurchasesScreenTheme = StyleSheet.create({
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
    marginBottom: 24,
  },

  callToActionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  paragraph: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const usePurchasesScreenFacade = (): [
  packages: PurchasesPackage[],
  activeSubscription: PurchasesEntitlementInfo | undefined,
  purchase: (subscription: PurchasesPackage) => void,
] => {
  return [useAvailablePackages(), useActiveSubscription(), usePurchaseSubscription()];
};
