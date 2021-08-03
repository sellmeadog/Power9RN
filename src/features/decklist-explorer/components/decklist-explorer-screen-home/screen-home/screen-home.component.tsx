import React, { FunctionComponent, useCallback } from 'react';
import { Alert } from 'react-native';

import { P9DrawerNavigatorHeader } from '../../../../../components';
import { P9UserDecklist } from '../../../../../core/data-user';
import { useUserDecklistExplorerFacade } from '../../../state/decklist-explorer.facade';
import { P9DecklistExplorer } from '../../decklist-explorer/decklist-explorer.component';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [_, onActivate, onRemove] = useHomeScreenFacade();
  const [data] = useUserDecklistExplorerFacade();

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

  return (
    <>
      <P9DrawerNavigatorHeader centerComponent={{ text: 'My Decks' }} />
      <P9DecklistExplorer sections={data} onActivate={onActivate} onLongPress={handleLongPress} />
      <P9DecklistExplorerActionButton decklistCount={0} />
    </>
  );
};
