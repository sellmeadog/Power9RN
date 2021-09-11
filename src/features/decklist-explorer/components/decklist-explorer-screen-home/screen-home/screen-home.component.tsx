import React, { FunctionComponent, useCallback } from 'react';
import { Alert } from 'react-native';

import { P9DrawerNavigatorHeader } from '../../../../../components';
import { useAuthorizationFacade } from '../../../../../core/authorization';
import { P9UserDecklist } from '../../../../../core/data-user';
import { P9AnonymousGuard } from '../../../../authorization';
import { useUserDecklistExplorerFacade } from '../../../state/decklist-explorer.facade';
import { P9DecklistExplorer } from '../../decklist-explorer/decklist-explorer.component';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [{ isAnonymous }] = useAuthorizationFacade();
  const [_, handleActivate, handleImportDecklist, onRemove] = useHomeScreenFacade();
  const [{ decklistCount, decklistGroups }] = useUserDecklistExplorerFacade();

  const handleLongPress = useCallback(
    (decklist: P9UserDecklist) => {
      Alert.alert(
        `Delete ${decklist.name}?`,
        'Are you sure you want to delete this deck? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'default' },
          { text: 'Delete', onPress: () => onRemove(decklist), style: 'destructive' },
        ],
      );
    },
    [onRemove],
  );

  return isAnonymous ? (
    <P9AnonymousGuard
      title={'Ready to start brewing?'}
      source={{
        uri: 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/f/e/feddbdc6-0757-43cb-bb41-dc83c6cf42ea.jpg?1627709701',
      }}
      subtitle={'Create a free Power 9 account to get started.'}
      bullets={[
        'Create up to 5 decks for free; upgrade to Power 9+ for unlimited',
        'Stored securely in a personal database',
        'Automatically synced across all of your devices',
      ]}
    />
  ) : (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'My Decks' }} />
      <P9DecklistExplorer sections={decklistGroups} onActivate={handleActivate} onLongPress={handleLongPress} />
      <P9DecklistExplorerActionButton decklistCount={decklistCount} onImportDecklist={handleImportDecklist} />
    </>
  );
};
