import React, { FunctionComponent } from 'react';

import { P9DrawerNavigatorHeader } from '../../../../../components';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  return (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'My Decks' }} />
      <P9DecklistExplorerActionButton decklistCount={0} />
    </>
  );
};
