import React, { FunctionComponent } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { PurchasesEntitlementInfo, PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useActiveSubscription, useAvailablePackages } from '../state/purchases.query';
import { usePurchaseSubscription } from '../state/purchases.service';
import { P9PurchasesButtonGroup } from './purchases-button-group.component';

export interface P9PurchasesScreenProps {}

export const P9PurchasesScreen: FunctionComponent<P9PurchasesScreenProps> = () => {
  const [packages, activeSubscription, handlePurchase] = usePurchasesScreenFacade();

  return (
    <ImageBackground
      source={{ uri: 'https://www.mtgnexus.com/img/gallery/3934-serra-the-benevolent.jpg?d=1591687873' }}
      resizeMode={'cover'}
      imageStyle={[P9PurchasesScreenTheme.backgroundImage]}
      style={[P9PurchasesScreenTheme.container]}
    >
      <SafeAreaView edges={['bottom']}>
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
    </ImageBackground>
  );
};

const P9PurchasesScreenTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: -200,
    right: 0,
    bottom: '30%',
  },

  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
});

const usePurchasesScreenFacade = (): [
  packages: PurchasesPackage[],
  activeSubscription: PurchasesEntitlementInfo | undefined,
  purchase: (subscription: PurchasesPackage) => void,
] => {
  return [useAvailablePackages(), useActiveSubscription(), usePurchaseSubscription()];
};
