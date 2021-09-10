import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import { useActiveEntitlementGuard } from '../../../../../core/purchases';
import { usePower9Theme } from '../../../../../core/theme';
import { useUserDecklistFeatureService } from '../../../state';

export interface P9DecklistExplorerActionButtonProps {
  decklistCount: number;
  onCreateDecklist?(): void;
  onImportDecklist?(): void;
}

export const P9DecklistExplorerActionButton: FunctionComponent<P9DecklistExplorerActionButtonProps> = ({
  decklistCount,
  onImportDecklist,
}) => {
  const [{ colors }] = usePower9Theme();
  const { navigate } = useNavigation();
  const service = useUserDecklistFeatureService();

  const canCreateDecklist = useActiveEntitlementGuard(
    'Wish you could keep brewing?\n',
    'Build unlimited decks with Power 9+',
    () => decklistCount < 5,
    () => {
      service.initCreateDecklistUI();
      navigate('P9:Modal:CreateDecklist');
    },
  );

  const canImportDecklist = useActiveEntitlementGuard(
    'Want to add another deck?\n',
    'Import unlimited decks with Power 9+',
    () => decklistCount < 5,
    () => onImportDecklist?.(),
  );

  const buttonTheme = { backgroundColor: colors?.primary, shadowColor: colors?.grey0 };

  return (
    <View style={P9DecklistCollectionScreenActionButtonStyle.container}>
      <Button
        buttonStyle={[P9DecklistCollectionScreenActionButtonStyle.actionButtonSecondary, buttonTheme]}
        containerStyle={[P9DecklistCollectionScreenActionButtonStyle.buttonContainer]}
        icon={{ color: colors?.white, name: 'file-download', size: 22 }}
        onPress={canImportDecklist}
      />
      <Button
        containerStyle={[P9DecklistCollectionScreenActionButtonStyle.buttonContainer]}
        buttonStyle={[P9DecklistCollectionScreenActionButtonStyle.actionButtonPrimary, buttonTheme]}
        icon={{ color: colors?.white, name: 'add', size: 28 }}
        onPress={canCreateDecklist}
      />
    </View>
  );
};

const P9DecklistCollectionScreenActionButtonStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 34,
    right: 20,
    alignItems: 'center',
    overflow: 'visible',
  },

  buttonContainer: {
    overflow: 'visible',
  },

  actionButtonPrimary: {
    margin: 0,
    padding: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    overflow: 'visible',
  },

  actionButtonSecondary: {
    margin: 0,
    padding: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    marginBottom: 16,
    overflow: 'visible',
  },
});
