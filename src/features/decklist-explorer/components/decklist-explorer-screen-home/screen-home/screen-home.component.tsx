import React, { FunctionComponent } from 'react';

import { P9DrawerNavigatorHeader } from '../../../../../components';
import { useAuthorizationFacade } from '../../../../../core/authorization';
import { P9AnonymousGuard } from '../../../../authorization';
import { useUserDecklistExplorerFacade } from '../../../state/decklist-explorer.facade';
import { P9DecklistExplorerSectionList } from '../../decklist-explorer/decklist-explorer-section-list.component';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [{ isAnonymous }] = useAuthorizationFacade();
  const [_, __, handleImportDecklist] = useHomeScreenFacade();
  const [{ decklistCount, decklistGroups }] = useUserDecklistExplorerFacade();

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
      <P9DecklistExplorerSectionList sections={decklistGroups} />
      <P9DecklistExplorerActionButton decklistCount={decklistCount} onImportDecklist={handleImportDecklist} />
    </>
  );
};
