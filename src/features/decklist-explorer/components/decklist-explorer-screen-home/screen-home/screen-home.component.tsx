import React, { FunctionComponent, useCallback } from 'react';
import { Alert, FlatList, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import { P9DrawerNavigatorHeader } from '../../../../../components';
import { P9UserDecklist } from '../../../../../core/data-user';
import { P9MagicCardArtwork } from '../../../../magic-cards';
import { P9DecklistExplorerActionButton } from './screen-home-action-button.component';
import { useHomeScreenFacade } from './screen-home.facade';

export interface P9DecklistExplorerHomeScreenProps {}

export const P9DecklistExplorerHomeScreen: FunctionComponent<P9DecklistExplorerHomeScreenProps> = () => {
  const [{ data }, onActivate, onRemove] = useHomeScreenFacade();

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
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => handleLongPress(item)}
            onPress={() => onActivate(item._id)}
            style={P9DecklistExplorerHomeScreenTheme.itemContainer}
          >
            <ImageBackground
              source={{ uri: item.metadata?.defaultCardArtworkUri }}
              style={P9DecklistExplorerHomeScreenTheme.itemBackground}
            >
              <Text style={[P9DecklistExplorerHomeScreenTheme.itemTitle]}>{item.name}</Text>
            </ImageBackground>
          </Pressable>
        )}
      />
      <P9DecklistExplorerActionButton decklistCount={0} />
    </>
  );
};

const P9DecklistExplorerHomeScreenTheme = StyleSheet.create({
  itemContainer: {
    padding: 32,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4.65,

    elevation: 8,
  },

  itemBackground: {
    aspectRatio: P9MagicCardArtwork.ASPECT_RATIO,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  itemTitle: {
    backgroundColor: '#000',
    fontFamily: 'Beleren2016-Bold',
    fontSize: 21,
    opacity: 0.9,
    paddingHorizontal: 10,
    paddingVertical: 16,
    textAlign: 'center',
  },
});
