import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, ButtonProps } from 'react-native-elements';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

export interface P9PurchasesButtonGroupProps extends ButtonProps {
  activeProductIdentifier?: string;
  packages?: PurchasesPackage[];
  onPurchase?: (pkg: PurchasesPackage) => void;
}

export const P9PurchasesButtonGroup: FunctionComponent<P9PurchasesButtonGroupProps> = ({
  activeProductIdentifier,
  packages,
  onPurchase,
}) => {
  return (
    <>
      {packages?.map((pkg) => (
        <View key={pkg.product.identifier}>
          <Button
            icon={
              pkg.product.identifier === activeProductIdentifier && {
                name: 'check-circle',
                color: '#fff',
                size: 22,
              }
            }
            iconContainerStyle={[P9PurchasesButtonGroupTheme.iconContainer]}
            containerStyle={[P9PurchasesButtonGroupTheme.buttonContainer]}
            onPress={() => onPurchase?.(pkg)}
            title={`${pkg.product.price_string ?? '-'}/${pkg.packageType === PACKAGE_TYPE.ANNUAL ? 'year' : 'month'}`}
            titleStyle={[P9PurchasesButtonGroupTheme.buttonTitle]}
          />
          <Badge
            badgeStyle={[P9PurchasesButtonGroupTheme.badge]}
            containerStyle={[P9PurchasesButtonGroupTheme.badgeContainer]}
            status={'error'}
            textStyle={[P9PurchasesButtonGroupTheme.badgeText]}
            value={pkg.product.description}
          />
        </View>
      ))}
    </>
  );
};

const P9PurchasesButtonGroupTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },

  buttonTitle: {
    fontFamily: 'Beleren2016-Bold',
    fontSize: 20,
    fontWeight: '600',
  },

  badgeContainer: {
    position: 'absolute',
    right: 32,
    top: -11,
  },

  badge: {
    borderColor: '#000',
    backgroundColor: '#fff',
    height: 22,
    borderWidth: 2,
    borderRadius: 11,
  },

  badgeText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 8,
  },

  iconContainer: {
    position: 'absolute',
    left: 4,
  },
});
